from fastapi import FastAPI

from backend.app.api.overview import router as overview_router
from backend.app.api.reviews import router as reviews_router
from backend.app.api.sentiment import router as sentiment_router


app = FastAPI(
    title="ReviewLens API",
    description="Customer Review Intelligence Platform API",
    version="1.0.0",
)

app.include_router(overview_router)
app.include_router(reviews_router)
app.include_router(sentiment_router)


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ReviewLens API",
    }