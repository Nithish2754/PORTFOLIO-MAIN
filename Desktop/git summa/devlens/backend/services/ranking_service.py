import math
from datetime import datetime, timezone

def calculate_rank_score(stars: int, forks: int, updated_at: str, watchers: int = 0) -> float:
    """
    Calculate repository rank score.
    
    Rank Score = 0.4 × log(stars+1) + 0.3 × log(forks+1) + 0.3 × activity_score
    Activity score decays over time (recent updates score higher)
    """
    try:
        # Parse the updated_at timestamp
        updated = datetime.fromisoformat(updated_at.replace("Z", "+00:00"))
        days_old = (datetime.now(timezone.utc) - updated).days
        
        # Activity decays: 100 points, -0.5 per day
        activity_score = max(0, 100 - days_old * 0.5)
    except Exception:
        activity_score = 0

    # Logarithmic scoring for stars and forks
    star_score = math.log(max(1, stars) + 1) * 10
    fork_score = math.log(max(1, forks) + 1) * 10

    # Weighted combination
    score = 0.4 * star_score + 0.3 * fork_score + 0.3 * activity_score
    return round(score, 2)
