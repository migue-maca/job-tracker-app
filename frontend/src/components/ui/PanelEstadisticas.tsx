"use client";

import { useEffect, useState } from "react";
import { obtenerEstadisticas } from "@/features/postulaciones/api";

/**
 * Panel de estadísticas globales de la plataforma.
 *
 * Muestra contadores clave: total, activas, en entrevista, ofertas,
 * desglose por canal y modalidad, tasa de conversión y actividad reciente.
 * Se actualiza cada vez que `recargar` cambia (tras crear/editar/eliminar).
 */
export function PanelEstadisticas({ recargar }: { recargar: number }) {
  const [stats, setStats] = useState({
    total: 0,
    activas: 0,
    en_entrevista: 0,
    ofertas_recibidas: 0,
    por_canal: {} as Record<string, number>,
    por_modalidad: {} as Record<string, number>,
    por_prioridad: {} as Record<string, number>,
    tasa_conversion: 0,
    ultimos_30_dias: 0,
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerEstadisticas()
      .then(setStats)
      .catch(console.error)
      .finally(() => setCargando(false));
  }, [recargar]);

  if (cargando) {
    return <p className="cargando">Cargando estadísticas...</p>;
  }

  return (
    <div className="panel-estadisticas">
      <h2 className="panel-estadisticas__titulo">Estadísticas</h2>

      <div className="panel-estadisticas__grid">
        <div className="tarjeta">
          <span className="tarjeta__valor">{stats.total}</span>
          <span className="tarjeta__label">Total</span>
        </div>
        <div className="tarjeta">
          <span className="tarjeta__valor">{stats.activas}</span>
          <span className="tarjeta__label">Activas</span>
        </div>
        <div className="tarjeta">
          <span className="tarjeta__valor">{stats.en_entrevista}</span>
          <span className="tarjeta__label">En entrevista</span>
        </div>
        <div className="tarjeta">
          <span className="tarjeta__valor">{stats.ofertas_recibidas}</span>
          <span className="tarjeta__label">Ofertas recibidas</span>
        </div>
        <div className="tarjeta">
          <span className="tarjeta__valor">{stats.tasa_conversion}%</span>
          <span className="tarjeta__label">Tasa de conversión</span>
        </div>
        <div className="tarjeta">
          <span className="tarjeta__valor">{stats.ultimos_30_dias}</span>
          <span className="tarjeta__label">Últimos 30 días</span>
        </div>
      </div>

      <div className="panel-estadisticas__desglose">
        <div className="desglose">
          <h3>Por canal</h3>
          {Object.entries(stats.por_canal).map(([canal, conteo]) => (
            <div key={canal} className="desglose__fila">
              <span>{canal}</span>
              <span>{conteo}</span>
            </div>
          ))}
        </div>
        <div className="desglose">
          <h3>Por modalidad</h3>
          {Object.entries(stats.por_modalidad).map(([modalidad, conteo]) => (
            <div key={modalidad} className="desglose__fila">
              <span>{modalidad}</span>
              <span>{conteo}</span>
            </div>
          ))}
        </div>
        <div className="desglose">
          <h3>Por prioridad</h3>
          {Object.entries(stats.por_prioridad).map(([prioridad, conteo]) => (
            <div key={prioridad} className="desglose__fila">
              <span>{prioridad}</span>
              <span>{conteo}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
