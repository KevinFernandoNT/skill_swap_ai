import os
import pickle
from pathlib import Path
from langchain_community.retrievers  import PineconeHybridSearchRetriever
from pinecone import Pinecone,ServerlessSpec
from langchain_huggingface import HuggingFaceEmbeddings
from pinecone_text.sparse import BM25Encoder
from langchain_core.documents import Document
from typing import List, Dict, Any, Optional

# Global instances
_hf_embeddings: Optional[HuggingFaceEmbeddings] = None
_pinecone_client: Optional[Pinecone] = None
_bm25_encoder: Optional[BM25Encoder] = None
_pinecone_index: Optional[Any] = None
_retriever: Optional[PineconeHybridSearchRetriever] = None

# Path for storing BM25 encoder
BM25_CACHE_PATH = Path("bm25_encoder_cache.pkl")


def save_bm25_encoder(encoder: BM25Encoder, cache_path: Path = BM25_CACHE_PATH):
    """
    Save BM25 encoder instance to disk for reuse.
    """
    try:
        with open(cache_path, 'wb') as f:
            pickle.dump(encoder, f)
        print(f"✓ BM25 encoder saved to {cache_path}")
    except Exception as e:
        print(f"Warning: Failed to save BM25 encoder: {e}")


def load_bm25_encoder(cache_path: Path = BM25_CACHE_PATH) -> Optional[BM25Encoder]:
    """
    Load BM25 encoder instance from disk if available.
    """
    try:
        if cache_path.exists():
            with open(cache_path, 'rb') as f:
                encoder = pickle.load(f)
            print(f"✓ BM25 encoder loaded from {cache_path}")
            return encoder
        else:
            print("No cached BM25 encoder found, will create new instance")
            return None
    except Exception as e:
        print(f"Warning: Failed to load cached BM25 encoder: {e}")
        return None


def initialize_global_instances():
    """
    Initialize global instances for embeddings, Pinecone client, and encoder.
    This should be called once when the API starts.
    """
    global _hf_embeddings, _pinecone_client, _bm25_encoder, _pinecone_index, _retriever
    
    try:
        # Get environment variables
        api_key = os.getenv("PINECONE_API_KEY")
        if not api_key:
            raise ValueError("PINECONE_API_KEY environment variable is required.")
        
        hf_token = os.getenv("HF_TOKEN")
        if hf_token:
            os.environ["HF_TOKEN"] = hf_token
        
        # Initialize HuggingFace embeddings
        _hf_embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        print("✓ HuggingFace embeddings initialized")
        
        # Initialize Pinecone client
        _pinecone_client = Pinecone(api_key=api_key)
        print("✓ Pinecone client initialized")
        
        # Try to load BM25 encoder from cache, create new if not available
        _bm25_encoder = load_bm25_encoder()
        if _bm25_encoder is None:
            print("Creating new BM25 encoder instance...")
            _bm25_encoder = BM25Encoder().default()
            # Save the new instance for future use
            save_bm25_encoder(_bm25_encoder)
        else:
            print("✓ BM25 encoder loaded from cache")
        
        # Initialize Pinecone index
        _pinecone_index = _pinecone_client.Index("hybrid-search-langchain-pinecone")
        print("✓ Pinecone index initialized")
        
        # Initialize retriever
        _retriever = PineconeHybridSearchRetriever(
            embeddings=_hf_embeddings, 
            sparse_encoder=_bm25_encoder, 
            index=_pinecone_index
        )
        print("✓ Pinecone hybrid search retriever initialized")
        
        print("All global instances initialized successfully!")
        
    except Exception as e:
        print(f"Error initializing global instances: {e}")
        raise


def get_global_retriver():
    """
    Get the global instances. Initialize them if they don't exist.
    """
    global _hf_embeddings, _pinecone_client, _bm25_encoder, _pinecone_index, _retriever
    
    if _retriever is None:
        initialize_global_instances()
    
    return _retriever


def clear_bm25_cache(cache_path: Path = BM25_CACHE_PATH):
    """
    Clear the cached BM25 encoder file.
    Useful if you want to force recreation of the encoder.
    """
    try:
        if cache_path.exists():
            cache_path.unlink()
            print(f"✓ BM25 encoder cache cleared: {cache_path}")
        else:
            print("No BM25 encoder cache found to clear")
    except Exception as e:
        print(f"Error clearing BM25 encoder cache: {e}")


def get_retrieval_results(queries: list[str]):
    """
    Get retrieval results using global instances for maximum efficiency.
    """
    if not isinstance(queries, list) or not queries:
        raise ValueError("Input 'queries' must be a non-empty list of strings.")
    if not all(isinstance(q, str) for q in queries):
        raise ValueError("All elements in 'queries' list must be strings.")

    combined_query = ",".join(queries).strip()

    if not combined_query:
        print("Warning: Combined query is empty after joining. No retrieval performed.")
        return []
    
    print(f"\n[get_retrieval_results] Invoking retriever for combined query: '{combined_query}'")
    
    if not combined_query or not isinstance(combined_query, str):
        raise ValueError("Query must be a non-empty string.")

    try:
        # Get global instances
        retriever = get_global_retriver()
        
        # Use the global retriever instance
        docs: list[Document] = retriever.invoke(combined_query)
        print(f"Retrieved {len(docs)} documents.")

        # Filter documents based on score threshold (0.5)
        page_contents = []
        for doc in docs:
            print(f"Document > {doc}")
            # Check if document has a score attribute and it's above 0.5
            if hasattr(doc, 'metadata') and 'score' in doc.metadata:
                score = doc.metadata['score']
                if score > 0.3:
                    page_contents.append(doc.page_content)
                    print(f"✓ Included document with score: {score}")
                else:
                    print(f"✗ Excluded document with score: {score} (below threshold)")
            else:
                # If no score attribute, include the document (fallback)
                page_contents.append(doc.page_content)
                print("⚠ Included document without score attribute")
        
        print(f"Final result: {len(page_contents)} documents with score > 0.3")
        return page_contents
    except Exception as e:
        print(f"Error during retrieval for query '{combined_query}': {e}")
        return [] # Return an empty list or re-raise the exception as appropriate


def upsert_text_to_pinecone(
    texts: List[str],
) -> bool:
    """
    Upsert text documents into Pinecone database using global instances for maximum efficiency.
    
    Args:
        texts: List of text documents to upsert
        
    Returns:
        bool: True if upsert was successful, False otherwise
    """
    if not isinstance(texts, list) or not texts:
        raise ValueError("Input 'texts' must be a non-empty list of strings.")
    
    if not all(isinstance(text, str) for text in texts):
        raise ValueError("All elements in 'texts' list must be strings.")
    
    print(f"\n[upsert_text_to_pinecone] Upserting {len(texts)} documents to Pinecone")
    
    try:
        # Get global instances
        retriever = get_global_retriver()
        
        # Use the global retriever instance to add texts
        retriever.add_texts(texts)
        
        print(f"Successfully upserted {len(texts)} documents to Pinecone index.")
        return True
        
    except Exception as e:
        print(f"Error during upsert to Pinecone: {e}")
        return False

def query_keywords_from_pinecone(
    keywords: List[str], 
    similarity_threshold: float = 0.0,
    namespace: str = ""
) -> List[str]:
    """
    Query Pinecone index directly with keywords and return most relevant keywords from results.
    
    Args:
        keywords: List of input keywords to search for
        similarity_threshold: Minimum similarity score to include results
        namespace: Pinecone namespace to search in
        
    Returns:
        List of relevant keywords extracted from Pinecone results
    """
    if not isinstance(keywords, list) or not keywords:
        raise ValueError("Input 'keywords' must be a non-empty list of strings.")
    
    if not all(isinstance(keyword, str) for keyword in keywords):
        raise ValueError("All elements in 'keywords' list must be strings.")
    
    # Clean keywords
    cleaned_keywords = [kw.strip() for kw in keywords if kw.strip()]
    if not cleaned_keywords:
        print("Warning: No valid keywords found after cleaning.")
        return []
    
    print(f"\n[query_keywords_from_pinecone] Querying with keywords: {cleaned_keywords}")
    print(f"[query_keywords_from_pinecone] Retrieving ALL results with threshold {similarity_threshold}")
    
    try:
        # Get global instances
        global _hf_embeddings, _pinecone_index
        
        if _hf_embeddings is None or _pinecone_index is None:
            initialize_global_instances()
        
        # Create combined query from keywords
        combined_query = " ".join(cleaned_keywords)
        
        # Generate embedding for the query
        query_embedding = _hf_embeddings.embed_query(combined_query)
        print(f"✓ Generated embedding for query: '{combined_query}'")
        
        # Query Pinecone index directly - set very high top_k to get all results
        query_response = _pinecone_index.query(
            vector=query_embedding,
            top_k=100, 
            include_metadata=True,
            include_values=False,
            namespace=""
        )
        print(f"✓ Pinecone returned {len(query_response.matches)} matches")
        
        # Extract and process results
        relevant_keywords = []
        for match in query_response.matches:
            score = match.score
            print(f"Match score: {score:.4f}")
            
            if score >= similarity_threshold:
                # Extract text content from metadata
                if hasattr(match, 'metadata') and match.metadata:
                    # Try different possible text keys
                    text_content = (
                        match.metadata.get('text') or 
                        match.metadata.get('content') or 
                        match.metadata.get('page_content') or
                        match.metadata.get('context') or
                        str(match.metadata)
                    )
                    
                    if text_content:
                        print(f"✓ Found relevant content (score: {score:.4f}): {text_content[:100]}...")
                        
                        # Directly append the text content instead of extracting keywords
                        relevant_keywords.append(text_content)
                else:
                    print(f"⚠ Match {match.id} has no metadata")
            else:
                print(f"✗ Excluded match with score {score:.4f} (below threshold {similarity_threshold})")
        
        # Remove duplicates and return unique keywords
        unique_keywords = list(set(relevant_keywords))
        print(f"Final result: {len(unique_keywords)} unique relevant keywords")
        print(f"Relevant keywords: {unique_keywords}")
        
        return unique_keywords
        
    except Exception as e:
        print(f"Error querying keywords from Pinecone: {e}")
        return []


def extract_keywords_from_text(text: str, original_keywords: List[str]) -> List[str]:
    """
    Extract relevant keywords from text content based on the original keywords.
    
    Args:
        text: Text content to extract keywords from
        original_keywords: Original input keywords for context
        
    Returns:
        List of extracted keywords
    """
    if not text or not isinstance(text, str):
        return []
    
    text_lower = text.lower()
    extracted_keywords = []
    
    # Split text into potential keywords (words and phrases)
    import re
    
    # Extract words (alphanumeric sequences)
    words = re.findall(r'\b\w+\b', text_lower)
    
    # Extract phrases (2-3 word combinations)
    word_list = text_lower.split()
    phrases = []
    for i in range(len(word_list) - 1):
        # 2-word phrases
        if i < len(word_list) - 1:
            phrases.append(f"{word_list[i]} {word_list[i+1]}")
        # 3-word phrases
        if i < len(word_list) - 2:
            phrases.append(f"{word_list[i]} {word_list[i+1]} {word_list[i+2]}")
    
    all_candidates = words + phrases
    
    # Filter candidates based on relevance to original keywords
    for candidate in all_candidates:
        candidate = candidate.strip()
        if len(candidate) < 2:  # Skip very short words
            continue
            
        # Check if candidate is related to any original keyword
        is_relevant = False
        for orig_keyword in original_keywords:
            orig_lower = orig_keyword.lower()
            # Check for exact match, substring, or shared words
            if (candidate == orig_lower or 
                candidate in orig_lower or 
                orig_lower in candidate or
                any(word in orig_lower for word in candidate.split()) or
                any(word in candidate for word in orig_lower.split())):
                is_relevant = True
                break
        
        if is_relevant and candidate not in extracted_keywords:
            extracted_keywords.append(candidate)
    
    # Limit the number of keywords returned
    return extracted_keywords[:20]  # Return max 20 keywords per text


def search_keywords(
    keywords: List[str], 
    top_k: int = 5, 
    similarity_threshold: float = 0.5,
    namespace: str = ""
) -> List[str]:
    """
    Simple keyword search that returns raw text content from Pinecone matches.
    
    Args:
        keywords: List of input keywords to search for
        top_k: Number of top results to retrieve from Pinecone
        similarity_threshold: Minimum similarity score to include results
        namespace: Pinecone namespace to search in
        
    Returns:
        List of text content from matching documents
    """
    if not isinstance(keywords, list) or not keywords:
        raise ValueError("Input 'keywords' must be a non-empty list of strings.")
    
    if not all(isinstance(keyword, str) for keyword in keywords):
        raise ValueError("All elements in 'keywords' list must be strings.")
    
    # Clean keywords
    cleaned_keywords = [kw.strip() for kw in keywords if kw.strip()]
    if not cleaned_keywords:
        print("Warning: No valid keywords found after cleaning.")
        return []
    
    print(f"\n[search_keywords] Searching with keywords: {cleaned_keywords}")
    
    try:
        # Get global instances
        global _hf_embeddings, _pinecone_index
        
        if _hf_embeddings is None or _pinecone_index is None:
            initialize_global_instances()
        
        # Create combined query from keywords
        combined_query = " ".join(cleaned_keywords)
        
        # Generate embedding for the query
        query_embedding = _hf_embeddings.embed_query(combined_query)
        
        # Query Pinecone index directly
        query_response = _pinecone_index.query(
            vector=query_embedding,
            top_k=top_k,
            include_metadata=True,
            include_values=False,
            namespace=namespace
        )
        
        # Extract text content from results
        results = []
        for match in query_response.matches:
            score = match.score
            
            if score >= similarity_threshold:
                # Extract text content from metadata
                if hasattr(match, 'metadata') and match.metadata:
                    text_content = (
                        match.metadata.get('text') or 
                        match.metadata.get('content') or 
                        match.metadata.get('page_content')
                    )
                    
                    if text_content and text_content not in results:
                        results.append(text_content)
                        print(f"✓ Added result (score: {score:.4f}): {text_content[:100]}...")
        
        print(f"Found {len(results)} relevant text results")
        return results
        
    except Exception as e:
        print(f"Error searching keywords in Pinecone: {e}")
        return []




