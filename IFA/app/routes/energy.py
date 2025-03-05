from fastapi import APIRouter, HTTPException
import json
import pandas as pd
from app.services.energy_burned import energy_kpis
# Importer le cache depuis le module cache_handler
from app.routes.cache_handler import cache

router = APIRouter(prefix="/energy", tags=["Calories Burned"])

def format_response(data):
    """Convertit les données en format JSON."""
    return json.loads(json.dumps(data, default=str))

@router.get("/{filename}")
async def get_energy_kpis(filename: str):
    """Calcul des KPIs liés à la consommation en énergie à partir des données en cache."""
    
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
    daily_avg, weekly_avg, monthly_avg, overall_avg, overall_avg_ev = energy_kpis(df_records)

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