from fastapi import APIRouter, UploadFile, File
#import pandas as pd
import json
from app.services.vomax_service import vomax_kpis
from app.services.file_parser import extract_data

router = APIRouter(prefix="/vomax", tags=["VO2Max KPIs"])

def format_response(data):
    """Convertit les données en format JSON."""
    return json.loads(json.dumps(data, default=str))

@router.post("/upload/")
async def upload_vomax_data(file: UploadFile = File(...)):
    """Upload du fichier et calcul des KPIs liés à la consommation d'oxygène (VO2Max)."""
    
    # Lire le fichier et extraire les données
    df_records = extract_data(file.file)
    
    # Calculer les KPIs
    daily_avg, weekly_avg, monthly_avg, overall_avg, overall_avg_ev = vomax_kpis(df_records)

    return {
        "status": "success",
        "data": format_response({
            "daily_avg": daily_avg.to_dict(orient="records"),
            "weekly_avg": weekly_avg.to_dict(orient="records"),
            "monthly_avg": monthly_avg.to_dict(orient="records"),
            "overall_avg": overall_avg,
            "overall_avg_ev": overall_avg_ev
        })
    }
