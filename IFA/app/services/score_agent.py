import os
import xml.etree.ElementTree as ET
import pandas as pd
from langchain_community.tools import DuckDuckGoSearchResults
from langchain.agents import Tool, AgentExecutor, create_react_agent
from langchain.prompts import PromptTemplate
from langchain_community.agent_toolkits.load_tools import load_tools
from langchain_ibm import ChatWatsonx
from app.config import WATSONX_URL, WATSONX_PROJECT_ID, WATSONX_APIKEY


"""from dotenv import load_dotenv

# Charger le fichier .env
load_dotenv()
WATSONX_URL = os.getenv('WATSONX_URL')
WATSONX_PROJECT_ID = os.getenv('WATSONX_PROJECT_ID')
WATSONX_APIKEY = os.getenv('WATSONX_APIKEY')"""

def process_uploaded_file(uploaded_file) -> pd.DataFrame:
    """Traite un fichier XML uploadé et extrait les données sous forme de DataFrame."""

    tree = ET.parse(uploaded_file)
    root = tree.getroot()
    records = []
    for record in root.findall(".//Record"):
        records.append(record.attrib)

    return pd.DataFrame(records)

def extract_metric(df_records: pd.DataFrame, metric_type: str) -> float:
    """Extrait une métrique spécifique depuis le DataFrame."""

    df_filtered = df_records[df_records['type'] == metric_type]
    if df_filtered.empty:
        return None
    values = df_filtered['value'].astype(float)

    return values.mean()

def get_step_count_score(df_records: pd.DataFrame) -> str:
    """Calculates the physical activity score based on step count."""

    avg_steps = extract_metric(df_records, "HKQuantityTypeIdentifierStepCount")
    if avg_steps is None:
        return "No step count data found."
    if avg_steps < 3000:
        score = "Sedentary: Try to incorporate more movement into your daily routine."
    elif 3000 <= avg_steps < 7000:
        score = "Lightly active: Good start, but aim for at least 7,000 steps per day."
    elif 7000 <= avg_steps < 10000:
        score = "Moderately active: Well done! You are close to the recommended goal."
    else:
        score = "Highly active: Excellent! You maintain a great level of physical activity."

    return f"Daily average step count: {avg_steps:.0f}\n Score: {score}"

def get_heart_rate_score(df_records: pd.DataFrame) -> str:
    """Calculates the score based on the latest recorded heart rate."""

    latest_hr = extract_metric(df_records, "HKQuantityTypeIdentifierHeartRate")
    if latest_hr is None:
        return "No heart rate data found."
    if latest_hr < 50:
        score = "Critical: Your heart rate is too low, consult a doctor."
    elif 50 <= latest_hr < 70:
        score = "Ideal: Your heart rate is optimal and reflects good physical health."
    elif 70 <= latest_hr < 90:
        score = "Normal: Your heart rate is within the average range."
    else:
        score = "High: Consult a healthcare professional immediately."

    return f"Average Heart Rate: {latest_hr:.0f} BPM\n Score: {score}"

def get_active_energy_score(df_records: pd.DataFrame) -> str:
    """Calculates the score based on active calories burned."""

    latest_calories = extract_metric(df_records, "HKQuantityTypeIdentifierActiveEnergyBurned")
    if latest_calories is None:
        return "No active energy data found."
    if latest_calories < 200:
        score = "Low: Try to increase your daily physical activity."
    elif 200 <= latest_calories < 500:
        score = "Moderate: Good effort, keep moving regularly!"
    elif 500 <= latest_calories < 800:
        score = "Active: Very good! You are maintaining a good fitness level."
    else:
        score = "Intense: Excellent! You have achieved a high level of activity."

    return f"Energy burned: {latest_calories:.0f} kcal\n Score: {score}"

def get_spo2_score(df_records: pd.DataFrame) -> str:
    """Calculates the score based on oxygen saturation (SpO₂)."""

    avg_spo2 = extract_metric(df_records, "HKQuantityTypeIdentifierOxygenSaturation")
    if avg_spo2 is None:
        return "No oxygen saturation data found."
    avg_spo2 *= 100  # Convert to percentage
    if avg_spo2 < 90:
        score = "Critical: Your SpO₂ is dangerously low, seek medical attention immediately."
    elif 90 <= avg_spo2 < 94:
        score = "Low: Your SpO₂ is below normal, monitor your condition closely."
    elif 94 <= avg_spo2 < 97:
        score = "Normal: Your oxygen saturation is within the expected range."
    else:
        score = "Excellent: Your respiratory and circulatory functions are optimal."

    return f"Average oxygen saturation (SpO₂): {avg_spo2:.2f}%\n Score: {score}"

# Initialisation des outils LangChain
step_count_tool = Tool(name="Step Count", description="Extracts step count and calculates a score.", func=get_step_count_score)
heart_rate_tool = Tool(name="Heart Rate", description="Extracts heart rate and calculates a score.", func=get_heart_rate_score)
active_energy_tool = Tool(name="Active Energy", description="Extracts active energy burned and calculates a score.", func=get_active_energy_score)
spo2_tool = Tool(name="Oxygen Saturation", description="Extracts oxygen saturation and calculates a score.", func=get_spo2_score)
search_tool = Tool(name="Web Search", description="A web search engine. Use this to search the internet for general queries.", func=DuckDuckGoSearchResults().run)

# Initialisation du modèle Watsonx
watsonx_model = ChatWatsonx(model_id="ibm/granite-3-8b-instruct", url=WATSONX_URL, project_id=WATSONX_PROJECT_ID, api_key=WATSONX_APIKEY)

tools = load_tools(["llm-math"], llm=watsonx_model)
tools.append(search_tool)
tools.append(heart_rate_tool)
tools.append(spo2_tool)
tools.append(active_energy_tool)
tools.append(step_count_tool)

react_template = """Answer the following question as best as you can. Don't give any arguments to heart rate tool please.
You have access to the following tools:

{tools}


Use the following format:

Question : The input question you must answer
Thought : you should always think about what to do
Action: The action to take, should be one of [{tool_names}]
Action Input : the input to the action
Observation : the result of the action
... (this thought/Action/Action input/Observation can repeat N times)
Thought: I know the final answer
Final Answer: The final answer to the original question

Begin!

Question: {input}
Thought: {agent_scratchpad}"""



# Création du PromptTemplate avec xml_content inclus
prompt = PromptTemplate(
    template=react_template,
    input_variables=["tools", "tool_names", "input", "agent_scratchpad"]
)

# Construct the ReAct agent
agent = create_react_agent(watsonx_model, tools, prompt)

agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True, 
    handle_parsing_errors=True
)


def analyze_health_data(df_records: pd.DataFrame) -> dict:
    """
    Analyse les données de santé à l'aide de l'agent IA et retourne uniquement les scores.
    Returns:
        dict: Dictionnaire contenant les scores pour chaque métrique
    """
    # Modifier le prompt pour demander spécifiquement les scores
    prompt = """Please analyze the health data and return the scores for each metric in this format:
    - Step count score
    - Heart rate score
    - Active energy score
    - SpO2 score
    Add an additional medical analysis based on the scores results. Give recommandations to the patient."""
    
    response = agent_executor.invoke({
        "input": prompt,
        "tools": [
            step_count_tool,
            heart_rate_tool,
            active_energy_tool,
            spo2_tool
        ]
    })

    # Traiter la réponse pour extraire les scores
    raw_output = response["output"]
    scores = {}

    # Utiliser les outils pour obtenir les données brutes
    steps_data = get_step_count_score(df_records)
    heart_data = get_heart_rate_score(df_records)
    energy_data = get_active_energy_score(df_records)
    spo2_data = get_spo2_score(df_records)

    # Extraire uniquement la partie score de chaque métrique
    scores = {
        'activity_score': steps_data.split("Score : ")[1] if "Score : " in steps_data else "Non disponible",
        'heart_score': heart_data.split("Score : ")[1] if "Score : " in heart_data else "Non disponible",
        'energy_score': energy_data.split("Score : ")[1] if "Score : " in energy_data else "Non disponible",
        'oxygen_score': spo2_data.split("Score : ")[1] if "Score : " in spo2_data else "Non disponible",
        'ai_analysis': raw_output.strip()
    }

    return {
        "scores": scores,
        "timestamp": pd.Timestamp.now().isoformat()
    }

if __name__ == "__main__":
    # Vérification du chargement des variables Watsonx
    print("\n🔍 **Vérification des variables Watsonx**")

    variables = {
        "WATSONX_APIKEY": WATSONX_APIKEY,
        "WATSONX_PROJECT_ID": WATSONX_PROJECT_ID,
        "WATSONX_URL": WATSONX_URL
    }

    for var_name, value in variables.items():
        status = "✔️ Chargé" if value else "❌ Non trouvé"
        print(f"{var_name}: {status}")

    # Affichage sécurisé des valeurs (API Key masquée pour sécurité)
    print("\n📌 **Valeurs des variables (⚠️ Masquage des API Keys pour sécurité)**")
    print(f"WATSONX_APIKEY: {WATSONX_APIKEY[:5]}***" if WATSONX_APIKEY else "❌ Non défini")
    print(f"WATSONX_PROJECT_ID: {WATSONX_PROJECT_ID if WATSONX_PROJECT_ID else '❌ Non défini'}")
    print(f"WATSONX_URL: {WATSONX_URL if WATSONX_URL else '❌ Non défini'}")
