# Skill Swap AI - Python API

A Python API for skill swapping functionality with AI-powered recommendations using Pinecone vector database and HuggingFace embeddings.

## Prerequisites
- Python 3.8 or higher
- Pinecone API key (get one at https://www.pinecone.io/)
- HuggingFace token (optional, get one at https://huggingface.co/settings/tokens)

## Setup

### 1. Create and activate virtual environment
```bash
# Create virtual environment
python -m venv venv

# Activate on Windows
.\venv\Scripts\activate

# Activate on macOS/Linux
source venv/bin/activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure environment variables
Copy the `.env.example` file to `.env` and add your API keys:
```bash
cp .env.example .env
```

Then edit `.env` and replace the placeholder values:
```env
PINECONE_API_KEY=your_actual_pinecone_api_key_here
HF_TOKEN=your_huggingface_token_here  # Optional
```

**Important:** 
- Get your Pinecone API key from: https://www.pinecone.io/
- The HF_TOKEN is optional but recommended for better performance
- Never commit your `.env` file to version control

### 4. Run the API
```bash
python src/main.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Base URL
`http://localhost:5000/api/v1`

### Available Routes
- `/api/v1/agents/*` - Agent-related endpoints
- `/api/v1/llm/*` - LLM-related endpoints

## Troubleshooting

### "PINECONE_API_KEY environment variable is required" Error
Make sure you have:
1. Created a `.env` file in the `api.py` directory
2. Added your Pinecone API key to the `.env` file
3. The `.env` file is in the same directory as `src/main.py`

### Index Not Found Error
If you get an error about the Pinecone index not existing:
1. Log in to your Pinecone dashboard
2. Create an index named `hybrid-search-langchain-pinecone`
3. Configure it with the appropriate dimensions for the embedding model
