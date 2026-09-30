"""
Servicio de Postulacion.

Capa de lógica de negocio. Orquesta las llamadas al repositorio
y aplica reglas de negocio antes de persistir.
"""

from sqlalchemy.orm import Session

from app.models.postulacion import Estado, Modalidad, Postulacion, Prioridad
from app.repositories import postulacion as repo
from app.schemas.postulacion import PostulacionCreate, PostulacionUpdate


def listar_postulaciones(
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
    Lista postulaciones aplicando filtros y ordenación.

    Regla de negocio: si se ordena por salario y el campo es NULL,
    esos registros van al final (se resuelve en la query del repositorio).
    """
    return repo.get_all(
        db,
        search=search,
        estado=estado,
        canal=canal,
        modalidad=modalidad,
        prioridad=prioridad,
        order_by=order_by,
        order_dir=order_dir,
    )


def obtener_postulacion(db: Session, postulacion_id: str) -> Postulacion | None:
    """Obtiene una postulación por ID."""
    return repo.get_by_id(db, postulacion_id)


def crear_postulacion(db: Session, data: PostulacionCreate) -> Postulacion:
    """
    Crea una nueva postulación.

    Regla de negocio: si salario_min > salario_max, se intercambian.
    """
    if (
        data.salario_min is not None
        and data.salario_max is not None
        and data.salario_min > data.salario_max
    ):
        data.salario_min, data.salario_max = data.salario_max, data.salario_min

    return repo.create(db, data)


def actualizar_postulacion(
    db: Session, postulacion_id: str, data: PostulacionUpdate
) -> Postulacion | None:
    """
    Actualiza una postulación existente.

    Regla de negocio: misma validación de rango salarial que en creación.
    """
    if (
        data.salario_min is not None
        and data.salario_max is not None
        and data.salario_min > data.salario_max
    ):
        data.salario_min, data.salario_max = data.salario_max, data.salario_min

    return repo.update(db, postulacion_id, data)


def eliminar_postulacion(db: Session, postulacion_id: str) -> bool:
    """Elimina una postulación por ID."""
    return repo.delete(db, postulacion_id)
