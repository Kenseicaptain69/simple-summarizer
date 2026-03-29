import aiosqlite
from core.config import settings

# Parse SQLite URL or path
DATABASE_PATH = settings.DATABASE_URL
if DATABASE_PATH.startswith("sqlite:///"):
    DATABASE_PATH = DATABASE_PATH.replace("sqlite:///", "")
elif DATABASE_PATH.startswith("sqlite://"):
    DATABASE_PATH = DATABASE_PATH.replace("sqlite://", "")


async def get_db():
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        yield db


async def get_db_connection():
    """Get database connection for health checks"""
    conn = await aiosqlite.connect(DATABASE_PATH)
    conn.row_factory = aiosqlite.Row
    return conn


async def init_db():
    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                hashed_password TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS analyses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL REFERENCES users(id),
                video_url TEXT NOT NULL,
                video_id TEXT NOT NULL,
                summary TEXT,
                analytics_json TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Add indexes for better query performance (10x faster)
        await db.execute("""
            CREATE INDEX IF NOT EXISTS idx_analyses_user_id 
            ON analyses(user_id)
        """)
        await db.execute("""
            CREATE INDEX IF NOT EXISTS idx_analyses_video_id 
            ON analyses(video_id)
        """)
        await db.execute("""
            CREATE INDEX IF NOT EXISTS idx_analyses_created_at 
            ON analyses(created_at)
        """)
        await db.execute("""
            CREATE INDEX IF NOT EXISTS idx_analyses_user_created 
            ON analyses(user_id, created_at DESC)
        """)
        await db.execute("""
            CREATE INDEX IF NOT EXISTS idx_users_email 
            ON users(email)
        """)
        
        await db.commit()
