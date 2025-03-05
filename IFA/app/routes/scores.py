from fastapi import APIRouter, HTTPException
import json
import pandas as pd
from app.services.score_agent import analyze_health_data
# Importer le cache depuis le module cache_handler
from app.routes.cache_handler import cache

router = APIRouter(prefix="/ai", tags=["AI Agent"])

@router.get("/scores/{filename}")
async def analyze_health(filename: str):
    """Analyse les données stockées en cache et retourne les scores des métriques santé."""
    try:
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
        
        if df_records.empty:
            raise HTTPException(status_code=400, detail="Données vides ou invalides.")
        
        # Analyser les données
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
        
        # Retourner la réponse
        return json.loads(json.dumps(response, default=str))
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'analyse des données : {str(e)}")