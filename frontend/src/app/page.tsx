"use client";

import { useEffect, useState } from "react";
import { TablaPostulaciones } from "@/components/ui/TablaPostulaciones";
import { Filtros } from "@/components/ui/Filtros";
import { Buscador } from "@/components/ui/Buscador";
import { FormularioPostulacion } from "@/components/ui/FormularioPostulacion";
import { PanelEstadisticas } from "@/components/ui/PanelEstadisticas";
import { usePostulaciones } from "@/features/postulaciones/hooks";
import { Postulacion, Orden } from "@/features/postulaciones/tipos";

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

  return (
    <main className="contenedor">
      <header className="cabecera">
        <h1>Gestor de Postulaciones</h1>
        <button
          className="btn btn-primario"
          onClick={() => {
            setPostulacionEditando(null);
            setMostrarFormulario(true);
          }}
        >
          + Nueva postulación
        </button>
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
    </main>
  );
}
