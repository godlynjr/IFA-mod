#import os
#import xml.etree.ElementTree as ET
import pandas as pd
import numpy as np
#import matplotlib.pyplot as plt
from app.services.file_parser import extract_data
from ibm_watsonx_ai.foundation_models import TSModelInference
from ibm_watsonx_ai.foundation_models.schema import TSForecastParameters
from app.services.watsonx_client import get_watsonx_client, get_watsonx_ts_model
from sklearn.metrics import mean_absolute_percentage_error

def load_timeseries_data(xml_file):
    """Charge les données XML et les transforme en DataFrame de fréquence cardiaque."""

    df_records = extract_data(xml_file)  #  Extract XML data
    #df_heart_rate_minute = process_heart_data(df_records)
    #df_prepared = prepare_forecasting_data(df_heart_rate_minute)

    return df_records

def process_heart_data(df_records):
    """Transforme df_records pour extraire et formater les données de fréquence cardiaque."""
    
    df_hr = df_records[df_records['type'] == "HKQuantityTypeIdentifierHeartRate"].copy()
    df_hr['startDate'] = pd.to_datetime(df_hr['startDate'])
    df_hr['endDate'] = pd.to_datetime(df_hr['endDate'])
    df_hr['value'] = pd.to_numeric(df_hr['value'], errors='coerce')
    df_hr['duration'] = (df_hr['endDate'] - df_hr['startDate']).dt.total_seconds()
    df_hr['minute'] = df_hr['startDate'].dt.floor('T')
    df_hr_minute = df_hr.groupby('minute').agg({'value': 'mean'}).reset_index()
    df_hr_minute.rename(columns={'value': 'avg_bpm'}, inplace=True)

    return df_hr_minute

def prepare_forecasting_data(df_heart_rate_minute):
    """Prépare les données pour le modèle de forecasting Watsonx."""

    df_heart_rate_hourly = df_heart_rate_minute.resample('H', on='minute').mean().reset_index()
    df_heart_rate_hourly = df_heart_rate_hourly.fillna(method='ffill')
    np.random.seed(42)
    df_heart_rate_hourly["avg_bpm"] += np.random.uniform(-2, 2, size=len(df_heart_rate_hourly))
    df = df_heart_rate_hourly.rename(columns={"minute": "date", "avg_bpm": "target"})
    df["date"] = pd.to_datetime(df["date"]).dt.strftime('%Y-%m-%dT%H:%M:%SZ')

    return df

def forecast_heart_rate(df):
    """Effectue un forecasting sur la fréquence cardiaque à l'aide du modèle Watsonx."""

    timestamp_column = "date"
    target_column = "target"
    context_length = 1536
    future_context = 96
    
    future_data = df.iloc[-future_context:,]
    data = df.iloc[-(context_length + future_context):-future_context,]
    
    client = get_watsonx_client()
    
    ts_model_id = get_watsonx_ts_model(client)

    ts_model = TSModelInference(
        model_id=ts_model_id,
        api_client=client
    )
    forecasting_params = TSForecastParameters(
        timestamp_column=timestamp_column, 
        freq="1h", 
        target_columns=[target_column],
    )
    results = ts_model.forecast(data=data, params=forecasting_params)['results'][0]
    
    mape = mean_absolute_percentage_error(future_data[target_column], results[target_column]) * 100
    
    return results, mape
