import anthropic
from typing import List, Dict, Tuple
import json
from app.config import CLAUDE_API_KEY


client = anthropic.Anthropic(api_key=CLAUDE_API_KEY)

def generate_medical_report(patient_data: dict, max_tokens=8000):
    """
    Génère un rapport médical détaillé et cohérent basé sur les données du patient.

    Args:
        patient_data (dict): Données médicales du patient (KPIs, tendances, analyses).
        max_tokens (int): Nombre maximum de tokens pour la génération.

    Returns:
        str: Rapport médical formaté et détaillé.
    """
    
    # Structuration des données en contexte médical
    patient_info = json.dumps(patient_data, indent=2)

    # Prompt pour le modèle IA
    prompt = f"""
    You are an experienced medical doctor and cardiologist. You have received the following patient data from a connected health monitoring system:

    ### Patient Health Data:
    {patient_info}

    Based on this data, generate a **detailed medical report** including:
    1. **Patient Overview** (General health assessment based on the provided metrics).
    2. **Detailed Analysis**:
        - Heart Rate Variability & Anomalies
        - Blood Oxygen Saturation & Respiratory Function
        - Physical Activity & Metabolism
        - Energy Burned & Recovery Capacity
    3. **Potential Risks & Medical Concerns** (Highlight any concerning trends or anomalies).
    4. **Recommendations**:
        - Lifestyle and health advice
        - If necessary, medical follow-up recommendations
        - Suggested diagnostic tests if anomalies are detected
    5. **Final Conclusion** (Summary of the patient’s health condition and next steps).

    Make sure the report is **formal, structured, and medically accurate**.
    """

    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=max_tokens,
        system="You are a professional medical AI specializing in cardiology and general health analysis. Your reports must be highly professional, medically accurate, and follow standard medical guidelines.",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.content[0].text