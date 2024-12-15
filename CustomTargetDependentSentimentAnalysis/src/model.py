import torch
import torch.nn as nn
from transformers import BertModel

class TargetSentimentClassifier(nn.Module):
    def __init__(self, bert_model_name='bert-base-uncased', num_classes=3, dropout_rate=0.1):
        super().__init__()
        self.bert = BertModel.from_pretrained(bert_model_name)
        
        # Target attention layer
        self.target_attention = nn.Sequential(
            nn.Linear(self.bert.config.hidden_size, self.bert.config.hidden_size),
            nn.Tanh(),
            nn.Linear(self.bert.config.hidden_size, 1)
        )
        
        # Classification layers
        self.dropout = nn.Dropout(dropout_rate)
        self.classifier = nn.Sequential(
            nn.Linear(self.bert.config.hidden_size * 2, self.bert.config.hidden_size),
            nn.ReLU(),
            nn.Dropout(dropout_rate),
            nn.Linear(self.bert.config.hidden_size, num_classes)
        )
        
    def forward(self, input_ids, attention_mask):
        # Get BERT outputs
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        sequence_output = outputs.last_hidden_state  # [batch_size, seq_len, hidden_size]
        pooled_output = outputs.pooler_output      # [batch_size, hidden_size]
        
        # Calculate attention weights
        attention_weights = self.target_attention(sequence_output)  # [batch_size, seq_len, 1]
        attention_weights = attention_weights.squeeze(-1)  # [batch_size, seq_len]
        attention_weights = attention_weights.masked_fill(~attention_mask.bool(), float('-inf'))
        attention_weights = torch.softmax(attention_weights, dim=1)
        
        # Apply attention to get target-aware representation
        target_aware_output = torch.bmm(attention_weights.unsqueeze(1), sequence_output).squeeze(1)
        
        # Concatenate pooled and target-aware outputs
        combined_output = torch.cat([pooled_output, target_aware_output], dim=1)
        
        # Classification
        logits = self.classifier(combined_output)
        return logits 