# News Target Sentiment Analysis Evaluation

## Overview
This project focuses on evaluating target-based sentiment analysis in news articles, building upon the NewsMTSC dataset introduced by [Hamborg & Donnay (2021)](https://aclanthology.org/2021.eacl-main.142/). The project aims to analyze sentiment towards specific targets (entities, topics, or events) within political news articles. Its component is part of a larger project [CMPT_713_NewsLens_TargetDependentSentimentAnalysis](https://github.sfu.ca/skm32/CMPT_713_NewsLens_TargetDependentSentimentAnalysis)

## Project Structure
```
CustomerTSP/
├── src/
│   ├── model.py         # BERT-based model architecture
│   ├── dataset.py       # Dataset processing
│   ├── train.py         # Training script
│   ├── evaluate.py      # Evaluation script with visualizations
├── results/             # Evaluation results and visualizations
├── checkpoints/         # Saved model checkpoints
└── requirements.txt     # Project dependencies
```

## Model Architecture
The project uses a BERT-based architecture with target-specific attention mechanism:
- Base Model: BERT (bert-base-uncased)
- Custom attention layer for target focus
- Classification head for 3-way sentiment prediction (negative, neutral, positive)

Key components (from `src/model.py`):
- Target attention mechanism for aspect-specific sentiment analysis
- Dropout layers for regularization
- Multi-layer classification head

## Dataset
The evaluation uses the NewsMTSC dataset, which contains:
- Political news articles with annotated targets
- Target-specific sentiment labels
- Multi-target sentences for comprehensive evaluation
- Longer text contexts compared to traditional sentiment datasets

## Setup and Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd CustomerTSP
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running Training

1. Train a new model:
```bash
python src/train.py \        
    --train_file data/train.jsonl \    
    --val_file data/devtest_mt.jsonl \       
    --batch_size 16 \
    --epochs 3 \
    --output_dir ./checkpoints
```

The training script will:
- Save the best model based on validation accuracy
- Display training progress with metrics
- Create checkpoints directory if it doesn't exist
- Use CUDA if available, otherwise CPU

Training parameters:
- `--train_file`: Path to training data (required)
- `--val_file`: Path to validation data (required)
- `--batch_size`: Training batch size (default: 16)
- `--epochs`: Number of training epochs (default: 3)
- `--output_dir`: Directory to save model checkpoints (default: ./checkpoints)

## Running Evaluation

1. Evaluate a trained model:
```bash
python src/evaluate.py \     
    --test_file data/devtest_rw.jsonl \
    --model_path checkpoints/best_model.pth \
    --batch_size 16
```

The evaluation script will:
- Generate confusion matrix visualization
- Create classification report plots
- Save detailed metrics in the output directory
- Print performance metrics to console:
  - Classification report with precision, recall, and F1-scores
  - Confusion matrix
  - Overall accuracy

Parameters:
- `--test_file`: Path to test data (required)
- `--model_path`: Path to saved model (required)
- `--batch_size`: Batch size for evaluation (default: 16)
- `--output_dir`: Directory to save evaluation results (default: ./results)

## Interpreting Results

The evaluation produces several outputs in the `results/` directory:

1. **Confusion Matrix** (`confusion_matrix.png`):
   - Shows prediction distribution across classes
   - Helps identify common misclassifications

2. **Classification Report** (`classification_metrics.png`):
   - Per-class precision, recall, and F1-scores
   - Overall model accuracy

3. **Detailed Metrics** (`evaluation_results.txt`):
   - Complete classification report
   - Raw confusion matrix
   - Overall accuracy score

Example metrics interpretation:
```
Accuracy: 0.81
Precision (class-wise):
- Negative: 0.85
- Neutral: 0.79
- Positive: 0.79
```

## Model Configuration
The model uses standard BERT configuration with custom modifications:
- Hidden size: 768
- Attention heads: 12
- Dropout rate: 0.1
- Target attention layer
- Custom classification head

## Citation
```
@inproceedings{hamborg-donnay-2021-newsmtsc,
    title = "{N}ews{MTSC}: A Dataset for (Multi-)Target-dependent Sentiment Classification in Political News Articles",
    author = "Hamborg, Felix and Donnay, Karsten",
    booktitle = "Proceedings of the 16th Conference of the European Chapter of the Association for Computational Linguistics: Main Volume",
    year = "2021",
    pages = "1663--1675",
    url = "https://aclanthology.org/2021.eacl-main.142"
}
```