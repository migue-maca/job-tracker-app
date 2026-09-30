"""
Modelo ORM de la entidad Postulacion.

Define la estructura de la tabla 'postulaciones' en PostgreSQL.
"""

import enum
from datetime import date
from uuid import uuid4

from sqlalchemy import Date, Enum, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Modalidad(str, enum.Enum):
    """Modalidad de trabajo de la oferta."""

    PRESENCIAL = "Presencial"
    REMOTO = "Remoto"
    HIBRIDO = "Hibrido"


class Estado(str, enum.Enum):
    """Estado de la postulación en el embudo de selección."""

    ENVIADA = "Enviada"
    EN_REVISION = "En revision"
    EN_ENTREVISTA = "En entrevista"
    RECHAZADO = "Rechazado"
    DESCARTADA = "Descartada"
    OFERTA_RECIBIDA = "Oferta recibida"


class Prioridad(str, enum.Enum):
    """Nivel de interés personal en la postulación."""

    BAJA = "Baja"
    MEDIA = "Media"
    ALTA = "Alta"


class TipoJornada(str, enum.Enum):
    """Tipo de jornada laboral de la oferta."""

    COMPLETA = "Completa"
    PARCIAL = "Parcial"


class Postulacion(Base):
    """Tabla de postulaciones de empleo."""

    __tablename__ = "postulaciones"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    fecha_postulacion: Mapped[date] = mapped_column(Date, nullable=False)
    empresa: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    puesto: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    canal_origen: Mapped[str] = mapped_column(String(100), nullable=False)
    modalidad: Mapped[Modalidad] = mapped_column(
        Enum(Modalidad, name="modalidad_enum"), nullable=False
    )
    ubicacion: Mapped[str] = mapped_column(String(255), nullable=False)
    salario_min: Mapped[int | None] = mapped_column(Integer, nullable=True)
    salario_max: Mapped[int | None] = mapped_column(Integer, nullable=True)
    salario_texto: Mapped[str | None] = mapped_column(String(255), nullable=True)
    estado: Mapped[Estado] = mapped_column(
        Enum(Estado, name="estado_enum"), nullable=False
    )
    prioridad: Mapped[Prioridad] = mapped_column(
        Enum(Prioridad, name="prioridad_enum"), nullable=False
    )
    tipo_jornada: Mapped[TipoJornada] = mapped_column(
        Enum(TipoJornada, name="tipo_jornada_enum"), nullable=False
    )
    enlace_oferta: Mapped[str | None] = mapped_column(String(500), nullable=True)
    tecnologias: Mapped[str | None] = mapped_column(Text, nullable=True)
    notas_seguimiento: Mapped[str | None] = mapped_column(Text, nullable=True)
    info_entrevistas: Mapped[str | None] = mapped_column(Text, nullable=True)
