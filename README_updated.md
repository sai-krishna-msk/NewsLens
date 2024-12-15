# News Lens
**A data-driven solution to address and overcome polarization in news.**

## Project Structure

```
├── CustomTargetDependentSentimentAnalysis/    # Custom sentiment analysis implementation
│   ├── src/                                   # Source code
│   ├── data/                                  # Dataset files
│   ├── checkpoints/                           # Model checkpoints
│   ├── results/                               # Analysis results
│   └── requirements.txt                       # Dependencies for sentiment analysis
│
├── End_to_End_Notebook/                       # End-to-end implementation notebooks
│
├── Result Analysis/                           # Analysis and evaluation results
│
├── portal/                                    # Web application
│   ├── NewsLens/                             # Main application code
│   └── Documents/                            # Documentation
│
├── scraping/                                  # News article scraping scripts
│
├── topic_modeling/                            # Topic modeling implementation
│
├── config/                                    # Configuration files
│
├── Research-Papers/                           # Related research papers
│
├── images/                                    # Project images and diagrams
│
├── requirements.txt                           # Main project dependencies
└── newslens.yml                              # Environment configuration
```

## Environment Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)
- Node.js and npm (for web portal)

### Setting up Virtual Environment

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- On macOS/Linux:
```bash
source venv/bin/activate
```
- On Windows:
```bash
.\venv\Scripts\activate
```

3. Install required packages:
```bash
pip install -r requirements.txt
```

4. For sentiment analysis module:
```bash
cd CustomTargetDependentSentimentAnalysis
pip install -r requirements.txt
```

5. For web portal:
```bash
cd portal
npm install
```

// ... existing code ... 