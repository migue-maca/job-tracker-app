"""
Router de Estadísticas.

Define el endpoint GET /api/estadisticas para obtener
los contadores globales de la plataforma.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.services import estadisticas as servicio

router = APIRouter(
    prefix="/api/estadisticas",
    tags=["estadisticas"],
)


@router.get("")
def obtener_estadisticas(db: Session = Depends(get_db)):
    """
    Devuelve las estadísticas globales de la plataforma.

    Incluye: total, activas, en entrevista, ofertas recibidas,
    desglose por canal, por modalidad, tasa de conversión y
    postulaciones de los últimos 30 días.
    """
    return servicio.obtener_estadisticas(db)
