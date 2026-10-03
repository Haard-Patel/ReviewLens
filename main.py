from fastapi import FastAPI

app = FastAPI(
    title="ReviewLens API",
    description="Customer Review Intelligence Platform API",
    version="1.0.0"
)


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ReviewLens API"
    }