import redis.asyncio as redis
import json
from config import settings
from typing import Any, Optional

# Global Redis client
_redis_client: Optional[redis.Redis] = None

async def get_redis_client() -> redis.Redis:
    """Get or create Redis client"""
    global _redis_client
    if _redis_client is None:
        _redis_client = await redis.from_url(settings.REDIS_URL, decode_responses=True)
    return _redis_client

async def get_cache(key: str) -> Optional[Any]:
    """Retrieve value from cache"""
    try:
        client = await get_redis_client()
        value = await client.get(key)
        if value:
            return json.loads(value)
    except Exception as e:
        print(f"Cache get error: {e}")
    return None

async def set_cache(key: str, value: Any, ttl: int = 300) -> bool:
    """Store value in cache with TTL (in seconds)"""
    try:
        client = await get_redis_client()
        await client.setex(key, ttl, json.dumps(value))
        return True
    except Exception as e:
        print(f"Cache set error: {e}")
    return False

async def delete_cache(key: str) -> bool:
    """Delete value from cache"""
    try:
        client = await get_redis_client()
        await client.delete(key)
        return True
    except Exception as e:
        print(f"Cache delete error: {e}")
    return False

async def clear_all_cache() -> bool:
    """Clear all cache"""
    try:
        client = await get_redis_client()
        await client.flushdb()
        return True
    except Exception as e:
        print(f"Cache clear error: {e}")
    return False
