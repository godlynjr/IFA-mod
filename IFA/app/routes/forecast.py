from fastapi import APIRouter, UploadFile, File
import pandas as pd
import json
from app.services.timeseries_forecasting import (
    load_timeseries_data,
    process_heart_data,
    prepare_forecasting_data,
    forecast_heart_rate
)

router = APIRouter(prefix="/timeseries", tags=["Time Series Forecasting"])

def format_response(data):
    """Convertit les données en format JSON."""
    return json.loads(json.dumps(data, default=str))

@router.post("/forecast/")
async def upload_and_forecast_heart_data(file: UploadFile = File(...)):
    """Upload du fichier XML et exécution du forecasting sur la fréquence cardiaque."""
    
    # Charger et traiter les données du fichier XML
    df_records = load_timeseries_data(file.file)
    df_heart_rate_minute = process_heart_data(df_records)
    df_prepared = prepare_forecasting_data(df_heart_rate_minute)
    
    # Exécuter le forecasting
    results, mape = forecast_heart_rate(df_prepared)
    
    return {
        "status": "success",
        "mape": mape,
        "forecast": format_response(results)
    }
