from fastapi import APIRouter, HTTPException

from app.schemas import PredictRequest, PredictResponse
from app.services.predictor import get_predictor

router = APIRouter(tags=["predict"])


@router.post("/predict", response_model=PredictResponse)
def predict_flood_risk(request: PredictRequest) -> PredictResponse:
    predictor = get_predictor()

    if not predictor.model_loaded:
        raise HTTPException(
            status_code=503,
            detail=(
                "Flood risk model is not loaded. "
                "Run scripts/train.py to generate models/flood_risk_model.joblib."
            ),
        )

    try:
        risk_level, risk_probability = predictor.predict(request)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    return PredictResponse(
        success=True,
        riskLevel=risk_level,
        riskProbability=risk_probability,
    )
