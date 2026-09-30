/**
 * Tipos TypeScript del dominio Postulacion.
 *
 * Reflejan el modelo de datos del backend (SPEC.md).
 * Las fechas son strings en formato ISO YYYY-MM-DD.
 */

export type Modalidad = "Presencial" | "Remoto" | "Hibrido";

export type Estado =
  | "Enviada"
  | "En revision"
  | "En entrevista"
  | "Rechazado"
  | "Descartada"
  | "Oferta recibida";

export type Prioridad = "Baja" | "Media" | "Alta";

export type TipoJornada = "Completa" | "Parcial";

export interface Postulacion {
  id: string;
  fecha_postulacion: string; // ISO YYYY-MM-DD
  empresa: string;
  puesto: string;
  canal_origen: string;
  modalidad: Modalidad;
  ubicacion: string;
  salario_min: number | null;
  salario_max: number | null;
  salario_texto: string | null;
  estado: Estado;
  prioridad: Prioridad;
  tipo_jornada: TipoJornada;
  enlace_oferta: string | null;
  tecnologias: string | null;
  notas_seguimiento: string | null;
  info_entrevistas: string | null;
}

export interface PostulacionCrear {
  fecha_postulacion: string;
  empresa: string;
  puesto: string;
  canal_origen: string;
  modalidad: Modalidad;
  ubicacion: string;
  salario_min?: number | null;
  salario_max?: number | null;
  salario_texto?: string | null;
  estado: Estado;
  prioridad: Prioridad;
  tipo_jornada: TipoJornada;
  enlace_oferta?: string | null;
  tecnologias?: string | null;
  notas_seguimiento?: string | null;
  info_entrevistas?: string | null;
}

export interface Filtros {
  estado: string;
  canal: string;
  modalidad: string;
  prioridad: string;
}

export interface Orden {
  campo: string;
  direccion: "asc" | "desc";
}
