"""
Router de Postulacion.

Define los endpoints REST para la entidad Postulacion.
Toda la lógica de negocio y acceso a datos se delega en el servicio.
"""

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models.postulacion import Estado, Modalidad, Prioridad
from app.schemas.postulacion import (
    PostulacionCreate,
    PostulacionImportar,
    PostulacionResponse,
    PostulacionUpdate,
)
from app.services import postulacion as servicio

router = APIRouter(
    prefix="/api/postulaciones",
    tags=["postulaciones"],
)


@router.get("/exportar", response_model=list[PostulacionResponse])
def exportar(db: Session = Depends(get_db)):
    """Devuelve todas las postulaciones para exportar como JSON."""
    return servicio.listar_postulaciones(db)


@router.get("", response_model=list[PostulacionResponse])
def listar(
    search: str | None = Query(default=None, description="Búsqueda global"),
    estado: Estado | None = Query(default=None, description="Filtro por estado"),
    canal: str | None = Query(default=None, description="Filtro por canal"),
    modalidad: Modalidad | None = Query(default=None, description="Filtro por modalidad"),
    prioridad: Prioridad | None = Query(default=None, description="Filtro por prioridad"),
    order_by: str = Query(default="fecha_postulacion", description="Campo de ordenación"),
    order_dir: str = Query(default="desc", description="Dirección: asc o desc"),
    db: Session = Depends(get_db),
):
    """
    Lista todas las postulaciones con filtros y ordenación opcionales.

    Parámetros de query:
    - search: subcadena en empresa, puesto o tecnologías
    - estado, canal, modalidad, prioridad: filtros exactos
    - order_by: 'fecha_postulacion', 'salario_min' o 'salario_max'
    - order_dir: 'asc' o 'desc'
    """
    return servicio.listar_postulaciones(
        db,
        search=search,
        estado=estado,
        canal=canal,
        modalidad=modalidad,
        prioridad=prioridad,
        order_by=order_by,
        order_dir=order_dir,
    )


@router.post("", response_model=PostulacionResponse, status_code=status.HTTP_201_CREATED)
def crear(data: PostulacionCreate, db: Session = Depends(get_db)):
    """Crea una nueva postulación."""
    return servicio.crear_postulacion(db, data)


@router.get("/{postulacion_id}", response_model=PostulacionResponse)
def obtener(postulacion_id: str, db: Session = Depends(get_db)):
    """Obtiene una postulación por su ID."""
    postulacion = servicio.obtener_postulacion(db, postulacion_id)
    if not postulacion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Postulación {postulacion_id} no encontrada",
        )
    return postulacion


@router.put("/{postulacion_id}", response_model=PostulacionResponse)
def actualizar(
    postulacion_id: str, data: PostulacionUpdate, db: Session = Depends(get_db)
):
    """Actualiza una postulación existente."""
    postulacion = servicio.actualizar_postulacion(db, postulacion_id, data)
    if not postulacion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Postulación {postulacion_id} no encontrada",
        )
    return postulacion


@router.delete("/{postulacion_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar(postulacion_id: str, db: Session = Depends(get_db)):
    """Elimina una postulación por su ID."""
    eliminado = servicio.eliminar_postulacion(db, postulacion_id)
    if not eliminado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Postulación {postulacion_id} no encontrada",
        )


@router.post("/importar", response_model=dict[str, int])
def importar(
    datos: list[PostulacionImportar],
    modo: str = "añadir",
    db: Session = Depends(get_db),
):
    """Importa postulaciones desde un archivo JSON.

    Args:
        datos: Lista de postulaciones a importar (body JSON).
        modo: "añadir" (por defecto) o "reemplazar".
        db: Sesión de base de datos.

    Returns:
        Dict con el resultado: {'creadas': N, 'duplicadas': M, 'errores': K}
    """
    resultado = servicio.importar_postulaciones(db, datos, modo)
    return resultado
