from fastapi import APIRouter, HTTPException, status, Depends
import aiosqlite
import uuid
from core.config import settings
from core.database import DATABASE_PATH
from core.security import hash_password, verify_password, create_access_token, get_current_user
from schemas.auth import SignupRequest, LoginRequest, TokenResponse, UserResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(body: SignupRequest):
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT id FROM users WHERE email = ?", (body.email,))
        existing = await cursor.fetchone()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )
        hashed = hash_password(body.password)
        cursor = await db.execute(
            "INSERT INTO users (email, hashed_password) VALUES (?, ?)",
            (body.email, hashed)
        )
        await db.commit()
    return {"message": "Account created successfully"}


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest):
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            "SELECT id, email, hashed_password FROM users WHERE email = ?",
            (body.email,)
        )
        row = await cursor.fetchone()
        if not row:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        if not verify_password(body.password, row["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        access_token = create_access_token(
            data={"sub": row["email"], "id": row["id"]}
        )
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        email=row["email"]
    )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=current_user["id"],
        email=current_user["email"],
        created_at=current_user["created_at"]
    )


@router.post("/guest", response_model=TokenResponse)
async def login_as_guest():
    """
    Auto-login as an anonymous guest user.
    Creates or reuses a guest account without needing email/password.
    """
    # Generate a unique guest email (guest_uuid@guest.local)
    guest_email = f"guest_{uuid.uuid4().hex[:12]}@guest.local"
    
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        
        # Create guest user account
        hashed = hash_password("guest_password_auto_generated")
        cursor = await db.execute(
            "INSERT INTO users (email, hashed_password) VALUES (?, ?)",
            (guest_email, hashed)
        )
        await db.commit()
        user_id = cursor.lastrowid
        
        # Generate JWT token for guest user
        access_token = create_access_token(
            data={"sub": guest_email, "id": user_id}
        )
        
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        email=guest_email
    )
