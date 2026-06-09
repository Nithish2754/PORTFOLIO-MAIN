from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load model once at module load
try:
    model = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    print(f"Warning: Could not load sentence transformer model: {e}")
    model = None

def get_similar_repos(target_repo: dict, all_repos: list, top_n: int = 5) -> list:
    """Find similar repositories using sentence embeddings"""
    if model is None or not all_repos:
        return []
    
    try:
        target_text = f"{target_repo.get('name', '')} {target_repo.get('description', '')} {' '.join(target_repo.get('topics', []))}"
        
        all_texts = [
            f"{r.get('name', '')} {r.get('description', '')} {' '.join(r.get('topics', []))}"
            for r in all_repos
        ]
        
        all_embeddings = model.encode(all_texts)
        target_embedding = model.encode([target_text])
        
        similarities = cosine_similarity(target_embedding, all_embeddings)[0]
        
        # Get top_n+1 (skip first which is the target itself)
        top_indices = np.argsort(similarities)[::-1][1:top_n+1]
        return [all_repos[i] for i in top_indices if i < len(all_repos)]
    except Exception as e:
        print(f"Similarity search error: {e}")
        return []
