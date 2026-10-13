"use client";

interface BuscadorProps {
  valor: string;
  onChange: (valor: string) => void;
}

/**
 * Caja de búsqueda global.
 * Filtra por subcadena en empresa, puesto o tecnologías.
 */
export function Buscador({ valor, onChange }: BuscadorProps) {
  return (
    <div className="buscador">
      <input
        id="buscador"
        name="buscador"
        type="text"
        placeholder="Buscar por empresa, puesto o tecnología..."
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="buscador__input"
      />
    </div>
  );
}
