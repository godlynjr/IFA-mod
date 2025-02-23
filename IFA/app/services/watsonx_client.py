from ibm_watsonx_ai import Credentials
from ibm_watsonx_ai import APIClient
from app.config import WATSONX_APIKEY, WATSONX_URL, WATSONX_PROJECT_ID


# Initialisation des credentials Watsonx
def get_watsonx_client():
    """Retourne une instance du client IBM Watsonx."""
    credentials = Credentials(
        url=WATSONX_URL,
        api_key=WATSONX_APIKEY
    )

    client = APIClient(credentials)
    client.set.default_project(WATSONX_PROJECT_ID)

    return client


# Initialisation du modèle de forecasting
def get_watsonx_ts_model(client):
    """Retourne une instance du modèle Watsonx Time Series."""
    ts_model_id = client.foundation_models.TimeSeriesModels.GRANITE_TTM_1536_96_R2
    return ts_model_id