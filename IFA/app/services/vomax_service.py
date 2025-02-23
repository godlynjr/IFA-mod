from app.utils import process_data, compute_metrics

def vomax_kpis(df_records):
    """Calcule les KPIs liés à la consommation en oxygène."""
    
    # Identifier spécifique à la fréquence cardiaque
    identifier = "HKQuantityTypeIdentifierVO2Max"
    
    # Obtenir les moyennes journalières, hebdomadaires et mensuelles
    daily_avg, weekly_avg, monthly_avg = process_data(df_records, identifier)

    # Calculer les métriques globales
    overall_avg, overall_avg_ev = compute_metrics(daily_avg)

    return daily_avg, weekly_avg, monthly_avg, overall_avg, overall_avg_ev