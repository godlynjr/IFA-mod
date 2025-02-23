from fastapi import APIRouter, UploadFile, File
#import pandas as pd
import json
from app.services.electro_cardiogram import load_ecg_data

router = APIRouter(prefix="/ecg", tags=["ECG Data"])

def format_response(data):
    """Convertit les données en format JSON."""
    return json.loads(json.dumps(data, default=str))

@router.post("/upload/")
async def upload_ecg_data(file: UploadFile = File(...)):
    """Upload du fichier ECG et renvoie les données traitées."""
    
    # Sauvegarder temporairement le fichier
    file_path = f"/tmp/{file.filename}"
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    # Charger et traiter les données ECG
    df_ecg, fs = load_ecg_data(file_path)

    return {
        "status": "success",
        "sampling_rate": fs,
        "data": format_response(df_ecg.to_dict(orient="records"))
    }
