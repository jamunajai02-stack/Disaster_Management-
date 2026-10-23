from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    rainfall: float = Field(..., ge=0, description="Rainfall in mm")
    temperature: float = Field(..., description="Temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Relative humidity percentage")
    windSpeed: float = Field(..., ge=0, description="Wind speed in km/h")
    pressure: float = Field(..., ge=800, le=1100, description="Atmospheric pressure in hPa")
    historicalRisk: float = Field(
        ..., ge=0, le=100, description="Historical flood risk score (0-100)"
    )
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)


class PredictResponse(BaseModel):
    success: bool = True
    riskLevel: str
    riskProbability: float = Field(
        ..., ge=0, le=1, description="Probability of the predicted risk level"
    )


class HealthResponse(BaseModel):
    success: bool
    service: str
    status: str
    modelLoaded: bool
    modelPath: str
    message: str
