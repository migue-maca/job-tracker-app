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
