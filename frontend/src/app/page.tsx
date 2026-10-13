"use client";

import { useEffect, useState } from "react";
import { TablaPostulaciones } from "@/components/ui/TablaPostulaciones";
import { Filtros } from "@/components/ui/Filtros";
import { Buscador } from "@/components/ui/Buscador";
import { FormularioPostulacion } from "@/components/ui/FormularioPostulacion";
import { PanelEstadisticas } from "@/components/ui/PanelEstadisticas";
import { DetallePostulacion } from "@/components/ui/DetallePostulacion";
import { usePostulaciones } from "@/features/postulaciones/hooks";
import { Postulacion, Orden } from "@/features/postulaciones/tipos";
import { exportarJSON, importarJSON } from "@/features/postulaciones/api";

interface ModalImportarState {
  abierto: boolean;
  modo: "añadir" | "reemplazar";
}

export default function Home() {
  const { postulaciones, cargando, error, recargar } = usePostulaciones();
  const [statsTick, setStatsTick] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({
    estado: "",
    canal: "",
    modalidad: "",
    prioridad: "",
  });
  const [orden, setOrden] = useState<Orden>({ campo: "fecha_postulacion", direccion: "desc" });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [postulacionEditando, setPostulacionEditando] = useState<Postulacion | null>(null);
  const [postulacionDetalle, setPostulacionDetalle] = useState<Postulacion | null>(null);
  const [modalImportar, setModalImportar] = useState<ModalImportarState>({
    abierto: false,
    modo: "añadir",
  });

  // Filtrado en cliente (los datos ya vienen del backend)
  const filtradas = postulaciones.filter((p) => {
    const texto = busqueda.toLowerCase();
    const coincideBusqueda =
      !texto ||
      p.empresa.toLowerCase().includes(texto) ||
      p.puesto.toLowerCase().includes(texto) ||
      (p.tecnologias || "").toLowerCase().includes(texto);

    const coincideEstado = !filtros.estado || p.estado === filtros.estado;
    const coincideCanal = !filtros.canal || p.canal_origen === filtros.canal;
    const coincideModalidad = !filtros.modalidad || p.modalidad === filtros.modalidad;
    const coincidePrioridad = !filtros.prioridad || p.prioridad === filtros.prioridad;

    return coincideBusqueda && coincideEstado && coincideCanal && coincideModalidad && coincidePrioridad;
  });

  // Ordenación en cliente
  const ordenadas = [...filtradas].sort((a, b) => {
    const campo = orden.campo as keyof Postulacion;
    const valA = a[campo] ?? "";
    const valB = b[campo] ?? "";
    const cmp = valA < valB ? -1 : valA > valB ? 1 : 0;
    return orden.direccion === "asc" ? cmp : -cmp;
  });

  const handleCreada = () => {
    setMostrarFormulario(false);
    recargar();
    setStatsTick((t) => t + 1);
  };

  const handleEditada = () => {
    setPostulacionEditando(null);
    setMostrarFormulario(false);
    recargar();
    setStatsTick((t) => t + 1);
  };

  const handleExportar = () => {
    exportarJSON().then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fecha = new Date().toLocaleDateString("es-ES").replace(/\//g, "-");
      a.download = `postulaciones-${fecha}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const handleImportar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
    const archivo = input?.files?.[0];

    if (!archivo) {
      alert("Por favor, selecciona un fichero.");
      return;
    }

    if (!archivo.name.endsWith(".json")) {
      alert("El fichero debe tener extensión .json.");
      return;
    }

    setModalImportar({ abierto: false, modo: modalImportar.modo });

    try {
      const resultado = await importarJSON(archivo, modalImportar.modo);
      let mensaje = `Importación completada: ${resultado.creadas} creadas`;
      if (resultado.duplicadas > 0) {
        mensaje += `, ${resultado.duplicadas} duplicadas omitidas`;
      }
      if (resultado.errores > 0) {
        mensaje += `, ${resultado.errores} errores`;
      }
      alert(mensaje);
      recargar();
      setStatsTick((t) => t + 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  return (
    <main className="contenedor">
      <header className="cabecera">
        <h1>Gestor de Postulaciones</h1>
        <div className="cabecera-derecha">
          <button
            className="btn btn-primario"
            onClick={() => {
              setPostulacionEditando(null);
              setMostrarFormulario(true);
            }}
          >
            + Nueva postulación
          </button>
          <button
            className="btn btn-secundario"
            onClick={() => setModalImportar({ abierto: true, modo: "añadir" })}
          >
            Importar
          </button>
          <button className="btn btn-secundario" onClick={handleExportar}>
            Exportar
          </button>
        </div>
      </header>

      <Buscador valor={busqueda} onChange={setBusqueda} />

      <Filtros filtros={filtros} onChange={setFiltros} />

      {cargando && <p className="cargando">Cargando...</p>}
      {error && <p className="error">Error: {error}</p>}

      <PanelEstadisticas recargar={statsTick} />

      <p className="info-filtro">
        {ordenadas.length} {ordenadas.length === 1 ? "postulación encontrada" : "postulaciones encontradas"}
      </p>

      <TablaPostulaciones
        postulaciones={ordenadas}
        orden={orden}
        onOrdenar={setOrden}
        onVerDetalle={setPostulacionDetalle}
        onEditar={(p) => {
          setPostulacionEditando(p);
          setMostrarFormulario(true);
        }}
        onEliminar={recargar}
      />

      {mostrarFormulario && (
        <FormularioPostulacion
          postulacion={postulacionEditando}
          onGuardar={postulacionEditando ? handleEditada : handleCreada}
          onCancelar={() => {
            setMostrarFormulario(false);
            setPostulacionEditando(null);
          }}
        />
      )}

      {modalImportar.abierto && (
        <div className="modal-overlay" onClick={() => setModalImportar({ abierto: false, modo: modalImportar.modo })}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Importar postulaciones</h2>
            <p>Selecciona un fichero JSON con las postulaciones a importar.</p>
            <p>
              Modo:{" "}
              <strong>
                {modalImportar.modo === "añadir" ? "Añadir a existentes" : "Reemplazar todo"}
              </strong>
            </p>
            <form onSubmit={handleImportar}>
              <label htmlFor="archivo-importar" className="btn btn-secundario">
                Seleccionar fichero JSON
              </label>
              <input
                id="archivo-importar"
                type="file"
                accept=".json"
                style={{ display: "none" }}
              />
              <div className="formulario__acciones">
                <button type="submit" className="btn btn-primario">
                  Importar
                </button>
                <button
                  type="button"
                  className="btn btn-secundario"
                  onClick={() => setModalImportar({ abierto: false, modo: modalImportar.modo })}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {postulacionDetalle && (
        <DetallePostulacion
          postulacion={postulacionDetalle}
          onCerrar={() => setPostulacionDetalle(null)}
          onEditar={(p) => {
            setPostulacionDetalle(null);
            setPostulacionEditando(p);
            setMostrarFormulario(true);
          }}
        />
      )}
    </main>
  );
}
