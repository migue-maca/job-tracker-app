"""
Esquema Pydantic para la respuesta de estadísticas.
"""

from pydantic import BaseModel


class EstadisticasResponse(BaseModel):
    """Respuesta del endpoint GET /api/estadisticas."""

    total: int
    activas: int
    en_entrevista: int
    ofertas_recibidas: int
    por_canal: dict[str, int]
    por_modalidad: dict[str, int]
    por_prioridad: dict[str, int]
    tasa_conversion: float
    ultimos_30_dias: int
