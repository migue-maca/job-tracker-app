"""
Punto de entrada de la aplicación FastAPI.

Configura el middleware CORS, inicializa la base de datos
y registra los routers de la API.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers import postulacion


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Eventos de ciclo de vida de la aplicación.

    Al arrancar: crea las tablas en la base de datos.
    """
    init_db()
    yield


# Instancia principal de FastAPI
app = FastAPI(
    title="Gestor de Postulaciones Laborales",
    description="API REST para registrar, filtrar y ordenar postulaciones de empleo.",
    version="1.0.0",
    lifespan=lifespan,
)

# Configuración CORS: solo acepta peticiones del frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registro de routers
app.include_router(postulacion.router)


@app.get("/health")
def health_check():
    """Endpoint de verificación de salud del servicio."""
    return {"status": "ok"}
