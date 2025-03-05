from fastapi import APIRouter, HTTPException
import pandas as pd
import json
from app.services.oxygen_sat import oxygen_kpis
from app.routes.cache_handler import cache


router = APIRouter(prefix="/oxygen", tags=["Oxygen KPIs"])

def format_response(data):
    """Convertit les données en format JSON."""
    return json.loads(json.dumps(data, default=str))

@router.post("/upload/")
async def upload_oxygen_data(filename: str):
    """Upload du fichier et calcul des KPIs liés à la saturation en oxygène."""

    # Récupérer les données depuis le cache
    cached_data = cache.get(filename)
    if cached_data is None:
        raise HTTPException(status_code=404, detail=f"File '{filename}' not found in cache. Upload the file first.")
    
    # Convertir les données en DataFrame si nécessaire
    if isinstance(cached_data, pd.DataFrame):
        df_records = cached_data
    elif isinstance(cached_data, dict) or isinstance(cached_data, list):
        try:
            # Si c'est une liste de dictionnaires (format le plus courant)
            if isinstance(cached_data, list) and all(isinstance(item, dict) for item in cached_data):
                df_records = pd.DataFrame(cached_data)
            # Si c'est un dictionnaire de format {colonne: [valeurs]}
            elif isinstance(cached_data, dict) and all(isinstance(cached_data[k], list) for k in cached_data):
                df_records = pd.DataFrame(cached_data)
            # Autres formats possibles de dictionnaire
            else:
                # Tenter une conversion générique
                df_records = pd.DataFrame.from_dict(cached_data, orient='records' if isinstance(cached_data, list) else 'columns')
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Failed to convert cached data to DataFrame: {str(e)}"
            )
    else:
        raise HTTPException(
            status_code=500, 
            detail=f"Cached data is not in a format that can be converted to DataFrame. Type: {type(cached_data)}"
        )    
    
    # Calculer les KPIs
    daily_avg, weekly_avg, monthly_avg, overall_avg, overall_avg_ev = oxygen_kpis(df_records)

    reponse = {
        "status": "success",
        "data": {
            "daily_avg": daily_avg.to_dict(orient="records"),
            "weekly_avg": weekly_avg.to_dict(orient="records"),
            "monthly_avg": monthly_avg.to_dict(orient="records"),
            "overall_avg": overall_avg,
            "overall_avg_ev": overall_avg_ev
        }
    }

    response = format_response(reponse)

    return response
