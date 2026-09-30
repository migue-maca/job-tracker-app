"""
Repositorio de Postulacion.

Capa de acceso a datos. Todas las consultas SQL se realizan aquí,
nunca en los routers ni en los servicios.
"""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.postulacion import Estado, Modalidad, Postulacion, Prioridad
from app.schemas.postulacion import PostulacionCreate, PostulacionUpdate


def get_all(
    db: Session,
    *,
    search: str | None = None,
    estado: Estado | None = None,
    canal: str | None = None,
    modalidad: Modalidad | None = None,
    prioridad: Prioridad | None = None,
    order_by: str = "fecha_postulacion",
    order_dir: str = "desc",
) -> list[Postulacion]:
    """
    Obtiene todas las postulaciones con filtros y ordenación opcionales.

    Args:
        db: Sesión de base de datos.
        search: Texto libre para buscar en empresa, puesto o tecnologías.
        estado: Filtro por estado exacto.
        canal: Filtro por canal de origen exacto.
        modalidad: Filtro por modalidad exacta.
        prioridad: Filtro por prioridad exacta.
        order_by: Campo por el que ordenar ('fecha_postulacion', 'salario_min', 'salario_max').
        order_dir: Dirección de ordenación ('asc' o 'desc').

    Returns:
        Lista de postulaciones que coinciden con los filtros.
    """
    stmt = select(Postulacion)

    # Filtro de búsqueda global (subcadena en empresa, puesto o tecnologías)
    if search:
        like_pattern = f"%{search}%"
        stmt = stmt.where(
            (Postulacion.empresa.ilike(like_pattern))
            | (Postulacion.puesto.ilike(like_pattern))
            | (Postulacion.tecnologias.ilike(like_pattern))
        )

    # Filtros exactos por campo
    if estado:
        stmt = stmt.where(Postulacion.estado == estado)
    if canal:
        stmt = stmt.where(Postulacion.canal_origen == canal)
    if modalidad:
        stmt = stmt.where(Postulacion.modalidad == modalidad)
    if prioridad:
        stmt = stmt.where(Postulacion.prioridad == prioridad)

    # Ordenación dinámica
    order_column = getattr(Postulacion, order_by, Postulacion.fecha_postulacion)
    if order_dir == "asc":
        stmt = stmt.order_by(order_column.asc())
    else:
        stmt = stmt.order_by(order_column.desc())

    return list(db.execute(stmt).scalars().all())


def get_by_id(db: Session, postulacion_id: str) -> Postulacion | None:
    """Obtiene una postulación por su ID. Devuelve None si no existe."""
    stmt = select(Postulacion).where(Postulacion.id == postulacion_id)
    return db.execute(stmt).scalar_one_or_none()


def create(db: Session, data: PostulacionCreate) -> Postulacion:
    """Crea una nueva postulación en la base de datos."""
    nueva = Postulacion(**data.model_dump())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


def update(
    db: Session, postulacion_id: str, data: PostulacionUpdate
) -> Postulacion | None:
    """
    Actualiza una postulación existente.

    Solo se modifican los campos que vienen con valor no nulo en `data`.
    """
    existente = get_by_id(db, postulacion_id)
    if not existente:
        return None

    for campo, valor in data.model_dump(exclude_unset=True).items():
        setattr(existente, campo, valor)

    db.commit()
    db.refresh(existente)
    return existente


def delete(db: Session, postulacion_id: str) -> bool:
    """
    Elimina una postulación por su ID.

    Returns:
        True si se eliminó, False si no existía.
    """
    existente = get_by_id(db, postulacion_id)
    if not existente:
        return False

    db.delete(existente)
    db.commit()
    return True
