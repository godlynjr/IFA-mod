# Importation des modules FastAPI après chargement des variables
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importation des routers
from app.routes.heart import router as heart_router
from app.routes.oxygen import router as oxygen_router
from app.routes.vomax import router as vomax_router
from app.routes.energy import router as energy_router
from app.routes.respiratory import router as respiratory_router
from app.routes.forecast import router as forecast_router
from app.routes.scores import router as scores_router
from app.routes.report import router as report_router
from app.routes.cache_handler import router as cache_router

# Initialisation de l'application FastAPI
app = FastAPI(title="Health Data API", version="1.0", description="API for Health data analysis")

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ajout des routes
app.include_router(heart_router)
app.include_router(oxygen_router)
app.include_router(vomax_router)
app.include_router(energy_router)
app.include_router(respiratory_router)
app.include_router(forecast_router)
app.include_router(scores_router)
app.include_router(report_router)
app.include_router(cache_router)

# Endpoint racine
@app.get("/")
async def root():
    return {"message": "Bienvenue sur l'API IFA Health Data 🚀"}


# Lancer l'application uniquement si exécutée directement
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
