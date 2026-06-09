# Models package
from pydantic import BaseModel
from typing import Optional

class RepositoryModel(BaseModel):
    id: int
    name: str
    full_name: str
    owner: str
    description: Optional[str] = None
    stars: int = 0
    forks: int = 0
    language: Optional[str] = None
    topics: list = []
    url: str
    updated_at: str
    rank_score: float = 0.0
