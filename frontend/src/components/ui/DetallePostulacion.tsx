"use client";

import { Postulacion } from "@/features/postulaciones/tipos";
import { formatearFecha } from "@/features/postulaciones/api";

interface DetalleProps {
  postulacion: Postulacion;
  onCerrar: () => void;
  onEditar: (p: Postulacion) => void;
}

/**
 * Modal de detalle que muestra todos los campos de una postulación.
 * Se abre al hacer clic en una fila de la tabla.
 */
export function DetallePostulacion({
  postulacion,
  onCerrar,
  onEditar,
}: DetalleProps) {
  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{postulacion.puesto} en {postulacion.empresa}</h2>

        <div className="detalle">
          <div className="detalle__campo">
            <span className="detalle__label">Fecha de postulación</span>
            <span className="detalle__valor">
              {formatearFecha(postulacion.fecha_postulacion)}
            </span>
          </div>

          <div className="detalle__campo">
            <span className="detalle__label">Canal de origen</span>
            <span className="detalle__valor">{postulacion.canal_origen}</span>
          </div>

          <div className="detalle__campo">
            <span className="detalle__label">Modalidad</span>
            <span className="detalle__valor">{postulacion.modalidad}</span>
          </div>

          <div className="detalle__campo">
            <span className="detalle__label">Tipo de jornada</span>
            <span className="detalle__valor">{postulacion.tipo_jornada}</span>
          </div>

          <div className="detalle__campo">
            <span className="detalle__label">Ubicación</span>
            <span className="detalle__valor">{postulacion.ubicacion}</span>
          </div>

          <div className="detalle__campo">
            <span className="detalle__label">Salario</span>
            <span className="detalle__valor">
              {postulacion.salario_min || postulacion.salario_max
                ? `${postulacion.salario_min ?? "?"} - ${postulacion.salario_max ?? "?"} €`
                : postulacion.salario_texto || "No especificado"}
            </span>
          </div>

          <div className="detalle__campo">
            <span className="detalle__label">Estado</span>
            <span className="detalle__valor">
              <span className={`badge badge--${postulacion.estado.toLowerCase().replace(/ /g, "-")}`}>
                {postulacion.estado}
              </span>
            </span>
          </div>

          <div className="detalle__campo">
            <span className="detalle__label">Prioridad</span>
            <span className="detalle__valor">{postulacion.prioridad}</span>
          </div>

          {postulacion.enlace_oferta && (
            <div className="detalle__campo">
              <span className="detalle__label">Enlace a la oferta</span>
              <span className="detalle__valor">
                <a
                  href={postulacion.enlace_oferta}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="detalle__enlace"
                >
                  Ver oferta
                </a>
              </span>
            </div>
          )}

          {postulacion.tecnologias && (
            <div className="detalle__campo">
              <span className="detalle__label">Tecnologías</span>
              <span className="detalle__valor">{postulacion.tecnologias}</span>
            </div>
          )}

          {postulacion.notas_seguimiento && (
            <div className="detalle__campo">
              <span className="detalle__label">Notas de seguimiento</span>
              <span className="detalle__valor">{postulacion.notas_seguimiento}</span>
            </div>
          )}

          {postulacion.info_entrevistas && (
            <div className="detalle__campo">
              <span className="detalle__label">Info de entrevistas</span>
              <span className="detalle__valor">{postulacion.info_entrevistas}</span>
            </div>
          )}
        </div>

        <div className="formulario__acciones">
          <button
            className="btn btn-primario"
            onClick={() => onEditar(postulacion)}
          >
            Editar
          </button>
          <button className="btn btn-secundario" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
