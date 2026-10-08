"use client";

import { Postulacion, Orden } from "@/features/postulaciones/tipos";
import { formatearFecha } from "@/features/postulaciones/api";

interface TablaProps {
  postulaciones: Postulacion[];
  orden: Orden;
  onOrdenar: (orden: Orden) => void;
  onVerDetalle: (p: Postulacion) => void;
  onEditar: (p: Postulacion) => void;
  onEliminar: () => void;
}

/**
 * Tabla interactiva de postulaciones.
 * Muestra solo la información más relevante para un primer vistazo.
 * Al hacer clic en una fila se abre el detalle completo.
 */
export function TablaPostulaciones({
  postulaciones,
  orden,
  onOrdenar,
  onVerDetalle,
  onEditar,
  onEliminar,
}: TablaProps) {
  const cambiarOrden = (campo: string) => {
    if (orden.campo === campo) {
      onOrdenar({
        campo,
        direccion: orden.direccion === "asc" ? "desc" : "asc",
      });
    } else {
      onOrdenar({ campo, direccion: "desc" });
    }
  };

  const indicador = (campo: string) => {
    if (orden.campo !== campo) return " ↕";
    return orden.direccion === "asc" ? " ↑" : " ↓";
  };

  if (postulaciones.length === 0) {
    return <p className="tabla-vacia">No hay postulaciones registradadas.</p>;
  }

  return (
    <div className="tabla-contenedor">
      <table className="tabla">
        <thead>
          <tr>
            <th onClick={() => cambiarOrden("fecha_postulacion")}>
              Fecha{indicador("fecha_postulacion")}
            </th>
            <th onClick={() => cambiarOrden("empresa")}>
              Empresa{indicador("empresa")}
            </th>
            <th onClick={() => cambiarOrden("puesto")}>
              Puesto{indicador("puesto")}
            </th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {postulaciones.map((p) => (
            <tr
              key={p.id}
              onClick={() => onVerDetalle(p)}
              className="tabla__fila-clicable"
            >
              <td>{formatearFecha(p.fecha_postulacion)}</td>
              <td>{p.empresa}</td>
              <td>{p.puesto}</td>
              <td>
                <span className={`badge badge--${p.estado.toLowerCase().replace(/ /g, "-")}`}>
                  {p.estado}
                </span>
              </td>
              <td onClick={(e) => e.stopPropagation()}>
                <button
                  className="btn btn-secundario btn--sm"
                  onClick={() => onEditar(p)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-peligro btn--sm"
                  onClick={async () => {
                    if (confirm("¿Eliminar esta postulación?")) {
                      const { eliminarPostulacion } = await import(
                        "@/features/postulaciones/api"
                      );
                      await eliminarPostulacion(p.id);
                      onEliminar();
                    }
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
