import pandas as pd

def process_data(df_records, identifier):
    """Transforme df_records et calcule les moyennes journalières, hebdomadaires et mensuelles pour un type de donnée spécifique."""
    
    # Filtrer uniquement les enregistrements correspondant à l'identifiant spécifié
    df_filtered = df_records[df_records['type'] == identifier].copy()

    # Conversion des dates en format datetime
    df_filtered['startDate'] = pd.to_datetime(df_filtered['startDate'])
    df_filtered['endDate'] = pd.to_datetime(df_filtered['endDate'])

    # Conversion des valeurs en float
    df_filtered['value'] = pd.to_numeric(df_filtered['value'], errors='coerce')

    # Ajouter les colonnes de date (jour, semaine, mois)
    df_filtered['day'] = df_filtered['startDate'].dt.date
    df_filtered['week'] = df_filtered['startDate'].dt.to_period('W').astype(str)
    df_filtered['month'] = df_filtered['startDate'].dt.to_period('M').astype(str)

    # Calcul des moyennes
    daily_avg = df_filtered.groupby('day')['value'].mean().reset_index().rename(columns={'value': 'daily_avg'})
    weekly_avg = df_filtered.groupby('week')['value'].mean().reset_index().rename(columns={'value': 'weekly_avg'})
    monthly_avg = df_filtered.groupby('month')['value'].mean().reset_index().rename(columns={'value': 'monthly_avg'})

    return daily_avg, weekly_avg, monthly_avg

def compute_metrics(df_avg):
    """Calcule les moyennes globales et les évolutions des valeurs journalières."""
    
    overall_avg = df_avg.iloc[:, 1].sum() / df_avg.iloc[:, 0].count()
    
    df_avg['evolution'] = df_avg.iloc[:, 1].pct_change() * 100
    
    df_avg.fillna(0.0, inplace=True)
    
    overall_avg_ev = df_avg['evolution'].sum() / df_avg.iloc[:, 0].count()
    
    return overall_avg, overall_avg_ev
