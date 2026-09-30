"use client";

import { useState } from "react";
import {
  Postulacion,
  PostulacionCrear,
  Modalidad,
  Estado,
  Prioridad,
  TipoJornada,
} from "@/features/postulaciones/tipos";
import { crearPostulacion, actualizarPostulacion } from "@/features/postulaciones/api";

interface FormularioProps {
  postulacion: Postulacion | null; // null = crear nueva
  onGuardar: () => void;
  onCancelar: () => void;
}

const MODALIDADES: Modalidad[] = ["Remoto", "Presencial", "Hibrido"];
const ESTADOS: Estado[] = [
  "Enviada",
  "En revision",
  "En entrevista",
  "Rechazado",
  "Descartada",
  "Oferta recibida",
];
const PRIORIDADES: Prioridad[] = ["Baja", "Media", "Alta"];
const TIPOS_JORNADA: TipoJornada[] = ["Completa", "Parcial"];

/**
 * Formulario modal para crear o editar una postulación.
 * Si `postulacion` es null, el formulario está en modo creación.
 */
export function FormularioPostulacion({
  postulacion,
  onGuardar,
  onCancelar,
}: FormularioProps) {
  const esEdicion = postulacion !== null;

  const [form, setForm] = useState<PostulacionCrear>({
    fecha_postulacion: postulacion?.fecha_postulacion || new Date().toISOString().split("T")[0],
    empresa: postulacion?.empresa || "",
    puesto: postulacion?.puesto || "",
    canal_origen: postulacion?.canal_origen || "",
    modalidad: postulacion?.modalidad || "Presencial",
    ubicacion: postulacion?.ubicacion || "",
    salario_min: postulacion?.salario_min ?? null,
    salario_max: postulacion?.salario_max ?? null,
    salario_texto: postulacion?.salario_texto || null,
    estado: postulacion?.estado || "Enviada",
    prioridad: postulacion?.prioridad || "Media",
    tipo_jornada: postulacion?.tipo_jornada || "Completa",
    enlace_oferta: postulacion?.enlace_oferta || null,
    tecnologias: postulacion?.tecnologias || null,
    notas_seguimiento: postulacion?.notas_seguimiento || null,
    info_entrevistas: postulacion?.info_entrevistas || null,
  });

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setError(null);

    try {
      if (esEdicion) {
        await actualizarPostulacion(postulacion.id, form);
      } else {
        await crearPostulacion(form);
      }
      onGuardar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setGuardando(false);
    }
  };

  const set = <K extends keyof PostulacionCrear>(campo: K, valor: PostulacionCrear[K]) =>
    setForm((f) => ({ ...f, [campo]: valor }));

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{esEdicion ? "Editar postulación" : "Nueva postulación"}</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit} className="formulario">
          <div className="formulario__grid">
            <label>
              Fecha de postulación *
              <input
                type="date"
                value={form.fecha_postulacion}
                onChange={(e) => set("fecha_postulacion", e.target.value)}
                required
              />
            </label>

            <label>
              Empresa *
              <input
                type="text"
                value={form.empresa}
                onChange={(e) => set("empresa", e.target.value)}
                required
              />
            </label>

            <label>
              Puesto *
              <input
                type="text"
                value={form.puesto}
                onChange={(e) => set("puesto", e.target.value)}
                required
              />
            </label>

            <label>
              Canal de origen *
              <input
                type="text"
                value={form.canal_origen}
                onChange={(e) => set("canal_origen", e.target.value)}
                required
              />
            </label>

            <label>
              Modalidad *
              <select
                value={form.modalidad}
                onChange={(e) => set("modalidad", e.target.value as Modalidad)}
                required
              >
                {MODALIDADES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Ubicación *
              <input
                type="text"
                value={form.ubicacion}
                onChange={(e) => set("ubicacion", e.target.value)}
                required
              />
            </label>

            <label>
              Salario mínimo (€)
              <input
                type="number"
                value={form.salario_min ?? ""}
                onChange={(e) =>
                  set("salario_min", e.target.value ? Number(e.target.value) : null)
                }
              />
            </label>

            <label>
              Salario máximo (€)
              <input
                type="number"
                value={form.salario_max ?? ""}
                onChange={(e) =>
                  set("salario_max", e.target.value ? Number(e.target.value) : null)
                }
              />
            </label>

            <label>
              Estado *
              <select
                value={form.estado}
                onChange={(e) => set("estado", e.target.value as Estado)}
                required
              >
                {ESTADOS.map((e2) => (
                  <option key={e2} value={e2}>
                    {e2}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Prioridad *
              <select
                value={form.prioridad}
                onChange={(e) => set("prioridad", e.target.value as Prioridad)}
                required
              >
                {PRIORIDADES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Tipo de jornada *
              <select
                value={form.tipo_jornada}
                onChange={(e) => set("tipo_jornada", e.target.value as TipoJornada)}
                required
              >
                {TIPOS_JORNADA.map((tj) => (
                  <option key={tj} value={tj}>
                    {tj}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Enlace a la oferta
              <input
                type="url"
                value={form.enlace_oferta ?? ""}
                onChange={(e) => set("enlace_oferta", e.target.value || null)}
              />
            </label>

            <label>
              Tecnologías
              <input
                type="text"
                value={form.tecnologias ?? ""}
                onChange={(e) => set("tecnologias", e.target.value || null)}
                placeholder="Python, FastAPI, Docker"
              />
            </label>
          </div>

          <label>
            Notas de seguimiento
            <textarea
              value={form.notas_seguimiento ?? ""}
              onChange={(e) => set("notas_seguimiento", e.target.value || null)}
              rows={3}
            />
          </label>

          <label>
            Info de entrevistas
            <textarea
              value={form.info_entrevistas ?? ""}
              onChange={(e) => set("info_entrevistas", e.target.value || null)}
              rows={3}
            />
          </label>

          <div className="formulario__acciones">
            <button
              type="submit"
              className="btn btn-primario"
              disabled={guardando}
            >
              {guardando ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              className="btn btn-secundario"
              onClick={onCancelar}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
