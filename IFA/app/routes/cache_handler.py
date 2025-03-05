from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.file_parser import extract_data
import xml.etree.ElementTree as ET
import pandas as pd
import json
import numpy as np

# Création du router
router = APIRouter()

# Cache en mémoire
cache = {}


# Fonction pour nettoyer les valeurs non JSON-compatibles
def clean_data(data):
    """ Nettoie les NaN, inf et -inf dans un dictionnaire avant conversion JSON. """
    if isinstance(data, dict):
        return {k: clean_data(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [clean_data(v) for v in data]
    elif isinstance(data, float):  # Gérer NaN et valeurs infinies
        if np.isnan(data) or np.isinf(data):
            return None
    return data


@router.post("/upload/")
async def upload_xml(file: UploadFile = File(...)):
    """
    Upload an XML file, extract its data, and store it in cache.
    """
    try:
        df_records = extract_data(file.file)

        # Vérifier si des données ont été extraites
        if df_records.empty:
            raise HTTPException(status_code=400, detail="No valid data found in the XML file.")

        # Stocker les données en cache (clé = nom du fichier)
        cache[file.filename] = df_records

        return {"message": "File successfully processed and stored in cache", "filename": file.filename}
    
    except ET.ParseError:
        raise HTTPException(status_code=400, detail="Invalid XML format. Please upload a valid XML file.")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@router.get("/data/{filename}")
async def get_data(filename: str):
    """ Récupère les données depuis le cache et les nettoie avant de renvoyer une réponse JSON. """
    data = cache.get(filename)
    if data is None:
        raise HTTPException(status_code=404, detail="Data not found")

    # Convertir le DataFrame en dictionnaire
    if isinstance(data, pd.DataFrame):
        # Convertir d'abord le DataFrame en dictionnaire
        data_dict = data.to_dict(orient='records')
        # Puis nettoyer les valeurs non conformes JSON
        cleaned_data = clean_data(data_dict)
        
        # Retourner les données directement (FastAPI s'occupera de la sérialisation JSON)
        return cleaned_data
    else:
        # Si ce n'est pas un DataFrame, nettoyer et renvoyer directement
        cleaned_data = clean_data(data)
        return cleaned_data


@router.delete("/clear-cache/")
async def clear_cache():
    """
    Clear all stored data from the cache.
    """
    cache.clear()
    return {"message": "Cache successfully cleared"}