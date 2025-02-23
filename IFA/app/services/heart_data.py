from app.utils import process_data, compute_metrics

def heart_kpis(df_records):
    """Calcule les KPIs liés à la fréquence cardiaque."""
    
    # Identifier spécifique à la fréquence cardiaque
    identifier = "HKQuantityTypeIdentifierHeartRate"
    
    # Obtenir les moyennes journalières, hebdomadaires et mensuelles
    daily_avg, weekly_avg, monthly_avg = process_data(df_records, identifier)

    # Calculer les métriques globales
    overall_avg, overall_avg_ev = compute_metrics(daily_avg)

    return daily_avg, weekly_avg, monthly_avg, overall_avg, overall_avg_ev

def heartrv_kpis(df_records):
    """Calcule les KPIs liés à la fréquence cardiaque."""
    
    # Identifier spécifique à la fréquence cardiaque
    identifier = "HKQuantityTypeIdentifierHeartRateVariabilitySDNN"
    
    # Obtenir les moyennes journalières, hebdomadaires et mensuelles
    daily_avg, weekly_avg, monthly_avg = process_data(df_records, identifier)

    # Calculer les métriques globales
    overall_avg, overall_avg_ev = compute_metrics(daily_avg)

    return daily_avg, weekly_avg, monthly_avg, overall_avg, overall_avg_ev
