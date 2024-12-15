import torch
from torch.utils.data import Dataset
import json

class TargetSentimentDataset(Dataset):
    def __init__(self, jsonl_file, tokenizer, max_length=128):
        self.data = []
        self.tokenizer = tokenizer
        self.max_length = max_length
        
        with open(jsonl_file, 'r', encoding='utf-8') as f:
            for line in f:
                if line.strip():  # Skip empty lines
                    item = json.loads(line)
                    sentence = item['sentence_normalized']
                    
                    for target in item['targets']:
                        # Convert polarity to label (0: negative, 1: neutral, 2: positive)
                        label = int((target['polarity'] - 2.0) / 2.0)
                        mention = target['mention']
                        self.data.append({
                            'sentence': sentence,
                            'target': mention,
                            'label': label
                        })
    
    def __len__(self):
        return len(self.data)
    
    def __getitem__(self, idx):
        item = self.data[idx]
        
        encoding = self.tokenizer(
            item['target'],
            item['sentence'],
            padding='max_length',
            truncation=True,
            max_length=self.max_length,
            return_tensors='pt'
        )
        
        return {
            'input_ids': encoding['input_ids'].squeeze(0),
            'attention_mask': encoding['attention_mask'].squeeze(0),
            'label': torch.tensor(item['label'])
        } 