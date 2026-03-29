from cachetools import TTLCache
from typing import Optional
import json
import hashlib

cache = TTLCache(maxsize=1000, ttl=3600)


def get_cache_key(prefix: str, *args) -> str:
    key_string = f"{prefix}:{':'.join(str(arg) for arg in args)}"
    return hashlib.md5(key_string.encode()).hexdigest()


def get_cached(key: str) -> Optional[dict]:
    return cache.get(key)


def set_cached(key: str, value: dict) -> None:
    cache[key] = value


def invalidate_cache(key: str) -> None:
    cache.pop(key, None)
