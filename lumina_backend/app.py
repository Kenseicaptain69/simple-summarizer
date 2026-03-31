import os
import uuid
import logging
from contextlib import asynccontextmanager
from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from core.database import init_db
from core.config import CORS_ORIGINS
from routers import auth, analyze, chat, history
import os
port = int(os.getenv("PORT", 8000))
# When running uvicorn, use: uvicorn main:app --host 0.0.0.0 --port $PORT
# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Application starting")
    await init_db()
    os.makedirs("./cache", exist_ok=True)
    yield
    logger.info("Application shutdown")


app = FastAPI(
    title="Glimpse API",
    version="1.0.0",
    lifespan=lifespan
)


app.add_middleware(GZipMiddleware, minimum_size=1000)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    logger.info(f"Request: {request.method} {request.url.path} - Status: {response.status_code}")
    return response


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.warning(f"HTTP Exception: {exc.status_code} - {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "code": exc.status_code,
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    request_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    logger.error(f"Unhandled exception (Request ID: {request_id}): {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error. Please try again later.",
            "code": 500,
        },
    )


app.include_router(auth.router)
app.include_router(analyze.router)
app.include_router(chat.router)
app.include_router(history.router)


@app.get("/api/health")
async def health_check():
    from core.database import get_db_connection
    db_status = "healthy"
    try:
        conn = await get_db_connection()
        await conn.execute("SELECT 1")
        await conn.close()
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "ok" if db_status == "healthy" else "degraded",
        "service": "Glimpse",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "database": db_status,
    }


@app.get("/")
async def root():
    return {"message": "Glimpse API is running. Visit /docs for the API reference."}



