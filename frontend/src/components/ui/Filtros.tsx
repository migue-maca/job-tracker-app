"use client";

import { Filtros as FiltrosTipo } from "@/features/postulaciones/tipos";

interface FiltrosProps {
  filtros: FiltrosTipo;
  onChange: (filtros: FiltrosTipo) => void;
}

const ESTADOS = [
  "Enviada",
  "En revision",
  "En entrevista",
  "Rechazado",
  "Descartada",
  "Oferta recibida",
];

const MODALIDADES = ["Remoto", "Presencial", "Hibrido"];
const PRIORIDADES = ["Baja", "Media", "Alta"];

/**
 * Panel de filtros combinables.
 * Cada selector filtra por un campo exacto del modelo.
 */
export function Filtros({ filtros, onChange }: FiltrosProps) {
  const actualizar = (campo: keyof FiltrosTipo, valor: string) => {
    onChange({ ...filtros, [campo]: valor });
  };

  return (
    <div className="filtros">
      <select
        value={filtros.estado}
        onChange={(e) => actualizar("estado", e.target.value)}
        className="filtros__select"
      >
        <option value="">Estado: todos</option>
        {ESTADOS.map((e) => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </select>

      <select
        value={filtros.canal}
        onChange={(e) => actualizar("canal", e.target.value)}
        className="filtros__select"
      >
        <option value="">Canal: todos</option>
        <option value="InfoJobs">InfoJobs</option>
        <option value="LinkedIn">LinkedIn</option>
        <option value="Web directa">Web directa</option>
        <option value="Randstad">Randstad</option>
        <option value="Indeed">Indeed</option>
        <option value="Lidl Jobs">Lidl Jobs</option>
        <option value="ICARO">ICARO</option>
        <option value="Trabajos.com">Trabajos.com</option>
        <option value="Adecco">Adecco</option>
        <option value="Kyndryl Jobs">Kyndryl Jobs</option>
        <option value="Hacesfalta.org">Hacesfalta.org</option>
        <option value="Manpower">Manpower</option>
        <option value="Glassdoor">Glassdoor</option>
        <option value="Otro">Otro</option>
      </select>

      <select
        value={filtros.modalidad}
        onChange={(e) => actualizar("modalidad", e.target.value)}
        className="filtros__select"
      >
        <option value="">Modalidad: todas</option>
        {MODALIDADES.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <select
        value={filtros.prioridad}
        onChange={(e) => actualizar("prioridad", e.target.value)}
        className="filtros__select"
      >
        <option value="">Prioridad: todas</option>
        {PRIORIDADES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <button
        className="btn btn-secundario"
        onClick={() =>
          onChange({ estado: "", canal: "", modalidad: "", prioridad: "" })
        }
      >
        Limpiar
      </button>
    </div>
  );
}
