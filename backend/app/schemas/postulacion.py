"""
Esquemas Pydantic v2 para validación y serialización de Postulacion.

Definen el formato de entrada (request) y salida (response) de la API.
Las fechas se manejan en formato ISO YYYY-MM-DD.
"""

from datetime import date
from uuid import UUID

from pydantic import BaseModel, Field, field_validator

from app.models.postulacion import Estado, Modalidad, Prioridad, TipoJornada


class PostulacionBase(BaseModel):
    """Campos comunes de una postulación."""

    fecha_postulacion: date
    empresa: str = Field(min_length=1, max_length=255)
    puesto: str = Field(min_length=1, max_length=255)
    canal_origen: str = Field(min_length=1, max_length=100)
    modalidad: Modalidad
    ubicacion: str = Field(min_length=1, max_length=255)
    salario_min: int | None = None
    salario_max: int | None = None
    salario_texto: str | None = Field(default=None, max_length=255)
    estado: Estado
    prioridad: Prioridad
    tipo_jornada: TipoJornada
    enlace_oferta: str | None = Field(default=None, max_length=500)
    tecnologias: str | None = None
    notas_seguimiento: str | None = None
    info_entrevistas: str | None = None


class PostulacionCreate(PostulacionBase):
    """Esquema para crear una nueva postulación."""
    pass


class PostulacionUpdate(BaseModel):
    """Esquema para actualizar una postulación (todos los campos opcionales)."""

    fecha_postulacion: date | None = None
    empresa: str | None = Field(default=None, min_length=1, max_length=255)
    puesto: str | None = Field(default=None, min_length=1, max_length=255)
    canal_origen: str | None = Field(default=None, min_length=1, max_length=100)
    modalidad: Modalidad | None = None
    ubicacion: str | None = Field(default=None, min_length=1, max_length=255)
    salario_min: int | None = None
    salario_max: int | None = None
    salario_texto: str | None = Field(default=None, max_length=255)
    estado: Estado | None = None
    prioridad: Prioridad | None = None
    tipo_jornada: TipoJornada | None = None
    enlace_oferta: str | None = Field(default=None, max_length=500)
    tecnologias: str | None = None
    notas_seguimiento: str | None = None
    info_entrevistas: str | None = None


class PostulacionResponse(PostulacionBase):
    """Esquema de respuesta con el ID incluido."""

    id: str

    class Config:
        from_attributes = True

    @field_validator("id", mode="before")
    @classmethod
    def convertir_id(cls, valor):
        """Convierte el UUID del ORM a string antes de la validación."""
        if isinstance(valor, UUID):
            return str(valor)
        return valor
