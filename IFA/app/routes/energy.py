from fastapi import APIRouter, UploadFile, File
#import pandas as pd
import json
from app.services.energy_burned import energy_kpis
from app.services.file_parser import extract_data

router = APIRouter(prefix="/energy", tags=["Energy KPIs"])

def format_response(data):
    """Convertit les données en format JSON."""
    return json.loads(json.dumps(data, default=str))

@router.post("/upload/")
async def upload_energy_data(file: UploadFile = File(...)):
    """Upload du fichier et calcul des KPIs liés à la consommation en énergie."""
    
    # Lire le fichier et extraire les données
    df_records = extract_data(file.file)
    
    # Calculer les KPIs
    daily_avg, weekly_avg, monthly_avg, overall_avg, overall_avg_ev = energy_kpis(df_records)

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
