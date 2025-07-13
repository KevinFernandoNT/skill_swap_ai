import os
import logging
from typing import Optional, List
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

# Global embeddings instance
_hf_embeddings: Optional[HuggingFaceEmbeddings] = None


def get_hf_embeddings(
    model_name: str = "all-MiniLM-L6-v2",
    device: str = "cpu",
    normalize_embeddings: bool = True
) -> HuggingFaceEmbeddings:
    """
    Get or create a global HuggingFace embeddings instance.
    If the embeddings model is already initialized, return the existing instance.
    Otherwise, create a new embeddings instance.
    
    Args:
        model_name: Name of the HuggingFace model to use for embeddings
        device: Device to run the model on ('cpu' or 'cuda')
        normalize_embeddings: Whether to normalize the embeddings
        
    Returns:
        HuggingFaceEmbeddings instance
    """
    global _hf_embeddings
    
    if _hf_embeddings is None:
        # Get HuggingFace token from environment variable
        hf_token = os.getenv('HF_TOKEN')
        
        if not hf_token:
            logger.warning("HF_TOKEN not found in environment variables. Using public models only.")
            # Create embeddings without token (uses public models)
            _hf_embeddings = HuggingFaceEmbeddings(
                model_name=model_name,
                model_kwargs={'device': device},
                encode_kwargs={'normalize_embeddings': normalize_embeddings}
            )
        else:
            # Create embeddings with token
            _hf_embeddings = HuggingFaceEmbeddings(
                model_name=model_name,
                model_kwargs={'device': device},
                encode_kwargs={'normalize_embeddings': normalize_embeddings},
                huggingfacehub_api_token=hf_token
            )
        
        logger.info(f"HuggingFace embeddings initialized with model: {model_name}")
    
    return _hf_embeddings
