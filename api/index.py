# Vercel serverless entrypoint — thin wrapper only.
# All routes, models and logic remain in ../server.py (zero functional change).
# Vercel's Python runtime imports `app` from this module for every request.
from server import app

__all__ = ["app"]
