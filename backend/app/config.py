"""
Configuración de la aplicación backend.

Lee las variables de entorno desde el fichero .env (si existe)
y las expone como atributos de un objeto Settings.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Configuración de la aplicación cargada desde variables de entorno."""

    DATABASE_URL: str = "postgresql+psycopg://jobtracker:975236@db:5432/jobtracker"

    class Config:
        env_file = ".env"


# Instancia global de configuración
settings = Settings()
