import torch
from torch.utils.data import DataLoader
from transformers import BertTokenizer
from tqdm import tqdm
import argparse
from sklearn.metrics import classification_report, confusion_matrix
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import os
from dataset import TargetSentimentDataset
from model import TargetSentimentClassifier

def plot_confusion_matrix(conf_matrix, label_names, output_dir):
    plt.figure(figsize=(10, 8))
    sns.heatmap(
        conf_matrix, 
        annot=True, 
        fmt='d', 
        cmap='Blues',
        xticklabels=label_names,
        yticklabels=label_names
    )
    plt.xlabel('Predicted')
    plt.ylabel('True')
    plt.title('Confusion Matrix')
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'confusion_matrix.png'), dpi=300, bbox_inches='tight')
    plt.close()

def plot_metrics(report_dict, output_dir):
    # Extract metrics for each class
    classes = list(report_dict.keys())[:-3]  # Exclude 'accuracy', 'macro avg', 'weighted avg'
    
    metrics_df = pd.DataFrame({
        'Precision': [report_dict[cls]['precision'] for cls in classes],
        'Recall': [report_dict[cls]['recall'] for cls in classes],
        'F1-Score': [report_dict[cls]['f1-score'] for cls in classes]
    }, index=classes)
    
    # Plot metrics
    plt.figure(figsize=(12, 6))
    metrics_df.plot(kind='bar', width=0.8)
    plt.title('Classification Metrics by Class')
    plt.xlabel('Class')
    plt.ylabel('Score')
    plt.legend(loc='lower right')
    plt.grid(True, alpha=0.3)
    plt.ylim(0, 1)
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'classification_metrics.png'), dpi=300, bbox_inches='tight')
    plt.close()
    
    # Save metrics as CSV
    metrics_df.to_csv(os.path.join(output_dir, 'classification_metrics.csv'))

def evaluate_model(model, test_loader, device, output_dir):
    model.eval()
    all_predictions = []
    all_labels = []
    
    with torch.no_grad():
        for batch in tqdm(test_loader, desc="Evaluating"):
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            labels = batch['label'].to(device)
            
            outputs = model(input_ids=input_ids, attention_mask=attention_mask)
            _, predicted = torch.max(outputs, 1)
            
            all_predictions.extend(predicted.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
    
    label_names = ['negative', 'neutral', 'positive']
    
    # Get classification report as dict and string
    report_dict = classification_report(all_labels, all_predictions, 
                                      target_names=label_names, 
                                      output_dict=True)
    report_str = classification_report(all_labels, all_predictions, 
                                     target_names=label_names)
    
    # Print reports to console
    print("\nClassification Report:")
    print(report_str)
    
    # Get and print confusion matrix
    conf_matrix = confusion_matrix(all_labels, all_predictions)
    print("\nConfusion Matrix:")
    print(conf_matrix)
    
    # Calculate and print accuracy
    accuracy = (np.array(all_predictions) == np.array(all_labels)).mean()
    print(f"\nAccuracy: {accuracy:.4f}")
    
    # Save results to text file
    with open(os.path.join(output_dir, 'evaluation_results.txt'), 'w') as f:
        f.write("Classification Report:\n")
        f.write(report_str)
        f.write("\n\nConfusion Matrix:\n")
        f.write(str(conf_matrix))
        f.write(f"\n\nAccuracy: {accuracy:.4f}")
    
    # Generate visualizations
    plot_confusion_matrix(conf_matrix, label_names, output_dir)
    plot_metrics(report_dict, output_dir)
    
    return accuracy

def main():
    parser = argparse.ArgumentParser(description='Evaluate Target Sentiment Classifier')
    parser.add_argument('--test_file', type=str, required=True, help='Path to test data')
    parser.add_argument('--model_path', type=str, required=True, help='Path to saved model')
    parser.add_argument('--batch_size', type=int, default=16, help='Batch size')
    parser.add_argument('--output_dir', type=str, default='./results', help='Directory to save evaluation results')
    args = parser.parse_args()

    # Create output directory if it doesn't exist
    os.makedirs(args.output_dir, exist_ok=True)

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")

    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    model = TargetSentimentClassifier().to(device)
    
    model.load_state_dict(torch.load(args.model_path))
    
    test_dataset = TargetSentimentDataset(args.test_file, tokenizer)
    test_loader = DataLoader(test_dataset, batch_size=args.batch_size)
    
    evaluate_model(model, test_loader, device, args.output_dir)

if __name__ == "__main__":
    main() 