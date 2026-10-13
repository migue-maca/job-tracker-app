"""
Servicio de Postulacion.

Capa de lógica de negocio. Orquesta las llamadas al repositorio
y aplica reglas de negocio antes de persistir.
"""

from sqlalchemy.orm import Session

from app.models.postulacion import Estado, Modalidad, Postulacion, Prioridad
from app.repositories import postulacion as repo
from app.schemas.postulacion import PostulacionCreate, PostulacionImportar, PostulacionUpdate


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


def importar_postulaciones(
    db: Session,
    lista: list[PostulacionImportar],
    modo: str = "añadir",
) -> dict[str, int]:
    """
    Importa múltiples postulaciones desde JSON.

    Modos:
    - "añadir": Añade a las existentes, preguntando por duplicados.
    - "reemplazar": Elimina todas y carga las nuevas (con confirmación).

    Returns:
        Dict con {'creadas': N, 'duplicadas': M, 'errores': K}
    """
    from fastapi import HTTPException

    resultado = {"creadas": 0, "duplicadas": 0, "errores": 0}
    existentes = repo.get_all(db)

    # Obtener claves únicas para detectar duplicados
    claves_existentes = {
        (
            p.empresa.lower().strip(),
            p.puesto.lower().strip(),
            str(p.fecha_postulacion),
        )
        for p in existentes
    }

    # Verificar duplicados
    duplicados: list[tuple[int, str]] = []
    for i, data in enumerate(lista):
        clave = (
            data.empresa.lower().strip(),
            data.puesto.lower().strip(),
            str(data.fecha_postulacion),
        )
        if clave in claves_existentes and modo == "añadir":
            duplicados.append((i, f"{data.empresa} - {data.puesto}"))
            resultado["duplicadas"] += 1

    if modo == "reemplazar":
        # Eliminar todas las postulaciones existentes
        for p in existentes:
            repo.delete(db, p.id)
        resultado["creadas"] = len(lista)
        # Crear todas las nuevas
        nuevas = repo.bulk_create(db, [PostulacionCreate(**d.model_dump()) for d in lista])
        resultado["creadas"] = len(nuevas)
        return resultado

    # Modo "añadir": crear solo las no duplicadas
    datos_no_duplicados = [
        data for i, data in enumerate(lista) if not any(d[0] == i for d in duplicados)
    ]

    if datos_no_duplicados:
        nuevas = repo.bulk_create(db, [PostulacionCreate(**d.model_dump()) for d in datos_no_duplicados])
        resultado["creadas"] = len(nuevas)

    resultado["duplicadas"] = len(duplicados)
    return resultado
