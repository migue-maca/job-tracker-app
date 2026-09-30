"use client";

import { useCallback, useEffect, useState } from "react";
import { obtenerPostulaciones } from "./api";
import { Postulacion } from "./tipos";

/**
 * Hook para gestionar el estado de las postulaciones.
 *
 * Carga inicial desde el backend y expone funciones para recargar.
 */
export function usePostulaciones() {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const datos = await obtenerPostulaciones();
      setPostulaciones(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { postulaciones, cargando, error, recargar };
}
