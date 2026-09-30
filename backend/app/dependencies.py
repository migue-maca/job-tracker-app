"""
Dependencias inyectables para los routers de FastAPI.

Proporciona la sesión de base de datos que se inyecta en cada endpoint.
"""

from collections.abc import Generator

from sqlalchemy.orm import Session

from app.database import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """
    Generador que produce una sesión de base de datos.

    Se usa como dependencia en los routers. La sesión se cierra
    automáticamente al finalizar la petición.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
