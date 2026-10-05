"""
Repositorio de Estadísticas.

Consultas de agregación para el panel de estadísticas.
Todas las queries SQL se realizan aquí, nunca en routers ni servicios.
"""

from datetime import date, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.postulacion import Estado, Postulacion


def contar_total(db: Session) -> int:
    """Total de postulaciones registradas."""
    return db.query(func.count(Postulacion.id)).scalar() or 0


def contar_activas(db: Session) -> int:
    """
    Procesos activos: todos excepto Rechazado y Descartada.
    """
    return (
        db.query(func.count(Postulacion.id))
        .filter(Postulacion.estado.notin_([Estado.RECHAZADO, Estado.DESCARTADA]))
        .scalar()
        or 0
    )


def contar_por_estado(db: Session, estado: str) -> int:
    """Conteo de postulaciones con un estado específico."""
    return (
        db.query(func.count(Postulacion.id))
        .filter(Postulacion.estado == estado)
        .scalar()
        or 0
    )


def contar_por_canal(db: Session) -> dict[str, int]:
    """
    Desglose de postulaciones por canal de origen.

    Returns:
        Diccionario {canal: conteo}.
    """
    resultados = (
        db.query(Postulacion.canal_origen, func.count(Postulacion.id))
        .group_by(Postulacion.canal_origen)
        .all()
    )
    return {canal: conteo for canal, conteo in resultados}


def contar_por_modalidad(db: Session) -> dict[str, int]:
    """
    Desglose de postulaciones por modalidad.

    Returns:
        Diccionario {modalidad: conteo}.
    """
    resultados = (
        db.query(Postulacion.modalidad, func.count(Postulacion.id))
        .group_by(Postulacion.modalidad)
        .all()
    )
    return {modalidad.value: conteo for modalidad, conteo in resultados}


def contar_ultimos_30_dias(db: Session) -> int:
    """Postulaciones registradas en los últimos 30 días."""
    limite = date.today() - timedelta(days=30)
    return (
        db.query(func.count(Postulacion.id))
        .filter(Postulacion.fecha_postulacion >= limite)
        .scalar()
        or 0
    )


def contar_por_prioridad(db: Session) -> dict[str, int]:
    """
    Desglose de postulaciones por prioridad.

    Returns:
        Diccionario {prioridad: conteo}.
    """
    resultados = (
        db.query(Postulacion.prioridad, func.count(Postulacion.id))
        .group_by(Postulacion.prioridad)
        .all()
    )
    return {prioridad.value: conteo for prioridad, conteo in resultados}
