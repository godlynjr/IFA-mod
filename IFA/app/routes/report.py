from fastapi import APIRouter, HTTPException
from app.services.medical_agent import generate_medical_report
import json

router = APIRouter(prefix="/medical", tags=["Medical Report"])

@router.post("/generate/")
async def generate_report(patient_data: dict):
    """Generates a detailed medical report based on patient data."""
    try:
        if not patient_data:
            raise HTTPException(status_code=400, detail="Patient data is required.")
        
        report = generate_medical_report(patient_data)
        response = {
            "status": "success",
            "data": {
                "medical_report": report
            }
        }
        return json.loads(json.dumps(response, default=str))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating medical report: {str(e)}")
