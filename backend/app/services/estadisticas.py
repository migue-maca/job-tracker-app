"""
Servicio de Estadísticas.

Capa de lógica de negocio para el panel de estadísticas.
Orquesta las consultas del repositorio y calcula métricas derivadas.
"""

from sqlalchemy.orm import Session

from app.repositories import estadisticas as repo


def obtener_estadisticas(db: Session) -> dict:
    """
    Calcula todas las estadísticas globales de la plataforma.

    Returns:
        Diccionario con los contadores y desgloses necesarios
        para el panel de estadísticas del frontend.
    """
    # Conteos básicos
    total = repo.contar_total(db)
    activas = repo.contar_activas(db)
    en_entrevista = repo.contar_por_estado(db, "En entrevista")
    ofertas = repo.contar_por_estado(db, "Oferta recibida")

    # Desgloses
    por_canal = repo.contar_por_canal(db)
    por_modalidad = repo.contar_por_modalidad(db)
    por_prioridad = repo.contar_por_prioridad(db)

    # Métricas derivadas
    tasa_conversion = round((ofertas / total) * 100, 1) if total > 0 else 0.0
    ultimos_30_dias = repo.contar_ultimos_30_dias(db)

    return {
        "total": total,
        "activas": activas,
        "en_entrevista": en_entrevista,
        "ofertas_recibidas": ofertas,
        "por_canal": por_canal,
        "por_modalidad": por_modalidad,
        "por_prioridad": por_prioridad,
        "tasa_conversion": tasa_conversion,
        "ultimos_30_dias": ultimos_30_dias,
    }
