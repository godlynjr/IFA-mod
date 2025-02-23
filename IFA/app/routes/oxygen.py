from fastapi import APIRouter, UploadFile, File
#import pandas as pd
import json
from app.services.oxygen_sat import oxygen_kpis
from app.services.file_parser import extract_data

router = APIRouter(prefix="/oxygen", tags=["Oxygen KPIs"])

def format_response(data):
    """Convertit les données en format JSON."""
    return json.loads(json.dumps(data, default=str))

@router.post("/upload/")
async def upload_oxygen_data(file: UploadFile = File(...)):
    """Upload du fichier et calcul des KPIs liés à la saturation en oxygène."""
    
    # Lire le fichier et extraire les données
    df_records = extract_data(file.file)
    
    # Calculer les KPIs
    daily_avg, weekly_avg, monthly_avg, overall_avg, overall_avg_ev = oxygen_kpis(df_records)

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
