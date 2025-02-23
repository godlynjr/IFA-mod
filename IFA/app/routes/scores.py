from fastapi import APIRouter, UploadFile, File, HTTPException
import json
from app.services.score_agent import process_uploaded_file, analyze_health_data

router = APIRouter(prefix="/ai", tags=["AI Agent"])

@router.post("/scores/")
async def analyze_health(file: UploadFile = File(...)):
    """Analyse un fichier XML uploadé et retourne les scores des métriques santé."""
    try:
        df_records = process_uploaded_file(file.file)
        if df_records.empty:
            raise HTTPException(status_code=400, detail="Fichier XML invalide ou vide.")
        
        scores = analyze_health_data(df_records)
        response = {
            "status": "success",
            "data": {
                "activity_score": scores["scores"].get("activity_score", "Non disponible"),
                "heart_score": scores["scores"].get("heart_score", "Non disponible"),
                "energy_score": scores["scores"].get("energy_score", "Non disponible"),
                "oxygen_score": scores["scores"].get("oxygen_score", "Non disponible"),
                "ai_analysis": scores["scores"].get("ai_analysis", "Non disponible"),
            },
            "timestamp": scores.get("timestamp")
        }
        return json.loads(json.dumps(response, default=str))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'analyse du fichier : {str(e)}")

