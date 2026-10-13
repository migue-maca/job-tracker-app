/**
 * Cliente HTTP para la API de postulaciones.

 * Todas las llamadas al backend pasan por aquí.
 * La URL base se configura con NEXT_PUBLIC_API_URL.
 */

import { Postulacion, PostulacionCrear } from "./tipos";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Formatea una fecha ISO (YYYY-MM-DD) al formato local español (DD-MM-YYYY).
 * Evita conversiones a UTC que desplacen el día natural.
 */
export function formatearFecha(fechaISO: string): string {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}-${mes}-${anio}`;
}

export async function obtenerPostulaciones(): Promise<Postulacion[]> {
  const res = await fetch(`${API_URL}/api/postulaciones`);
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
}

export async function crearPostulacion(
  data: PostulacionCrear
): Promise<Postulacion> {
  const res = await fetch(`${API_URL}/api/postulaciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
}

export async function actualizarPostulacion(
  id: string,
  data: Partial<PostulacionCrear>
): Promise<Postulacion> {
  const res = await fetch(`${API_URL}/api/postulaciones/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
}

export async function eliminarPostulacion(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/postulaciones/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
}

export interface Estadisticas {
  total: number;
  activas: number;
  en_entrevista: number;
  ofertas_recibidas: number;
  por_canal: Record<string, number>;
  por_modalidad: Record<string, number>;
  por_prioridad: Record<string, number>;
  tasa_conversion: number;
  ultimos_30_dias: number;
}

export interface ResultadoImportar {
  creadas: number;
  duplicadas: number;
  errores: number;
}

export async function exportarJSON(): Promise<Blob> {
  const res = await fetch(`${API_URL}/api/postulaciones/exportar`, {
    method: "GET",
    headers: { "Accept": "application/json" },
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.blob();
}

export async function importarJSON(archivo: File, modo: "añadir" | "reemplazar" = "añadir"): Promise<ResultadoImportar> {
  const contenido = await archivo.text();
  const res = await fetch(`${API_URL}/api/postulaciones/importar?modo=${modo}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: contenido,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.detail || `Error ${res.status}`);
  }
  return res.json();
}

export async function obtenerEstadisticas(): Promise<Estadisticas> {
  const res = await fetch(`${API_URL}/api/estadisticas`);
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
}
