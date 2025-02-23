from app.services.file_parser import parse_ecg_file
import pandas as pd
import numpy as np

def load_ecg_data(file_path):
    """Charge et nettoie les données ECG à partir d'un fichier CSV Apple Watch."""

    # Récupérer les données ECG brutes depuis le fichier parser
    ecg_values = parse_ecg_file(file_path)

    # Définir la fréquence d'échantillonnage détectée dans le fichier
    fs = 512  # Apple Watch ECG : 512 Hz

    # Générer la colonne de temps en secondes
    duration_seconds = 60  # Enregistrement sur 1 minute
    num_samples = len(ecg_values)
    time_values = np.linspace(0, duration_seconds, num_samples)

    # Construire un DataFrame propre
    df_ecg = pd.DataFrame({"time": time_values, "signal": ecg_values})

    return df_ecg, fs
