"""
Configuración de la base de datos.

Crea el motor de SQLAlchemy, la sesión y la base para los modelos.
También incluye la función init_db() que crea las tablas al arrancar.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import settings

# Motor de conexión a PostgreSQL
engine = create_engine(settings.DATABASE_URL, echo=False)

# Fábrica de sesiones
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Clase base para todos los modelos ORM."""
    pass


def init_db() -> None:
    """Crea todas las tablas definidas en los modelos si no existen."""
    # Importar modelos para que SQLAlchemy los registre antes de crear tablas
    from app.models import postulacion  # noqa: F401

    Base.metadata.create_all(bind=engine)
