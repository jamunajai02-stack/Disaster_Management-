from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.predict import router as predict_router
from app.config import get_settings
from app.schemas import HealthResponse
from app.services.predictor import get_predictor

settings = get_settings()

app = FastAPI(
    title="SDRP Flood Risk ML Service",
    description=(
        "Flood risk estimates for the Smart Disaster Response Platform. "
        "Predictions are risk estimates for a college project, not official warnings."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router)


@app.on_event("startup")
def load_model_on_startup() -> None:
    get_predictor().load()


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    predictor = get_predictor()
    model_loaded = predictor.model_exists()

    if model_loaded:
        message = "ML service is running with flood risk model loaded."
    else:
        message = (
            "ML service is running but the flood risk model is missing. "
            "Run scripts/train.py to generate models/flood_risk_model.joblib."
        )

    return HealthResponse(
        success=True,
        service="sdrp-ml",
        status="ok",
        modelLoaded=model_loaded,
        modelPath=settings.model_path,
        message=message,
    )
