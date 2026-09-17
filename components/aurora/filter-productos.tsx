"use client";

import { useState } from "react";
import { TIPO_LABEL, type TipoPieza } from "@/lib/products";
import s from "@/app/aurora/aurora.module.css";

const TIPOS_DISPONIBLES: TipoPieza[] = [
  "conjunto",
  "body",
  "bra",
  "panty",
  "tanga",
  "liguero",
  "brasiera",
  "longline",
  "complemento",
];

type FilterProductosProps = {
  children: (filtro: TipoPieza | null) => React.ReactNode;
};

export default function FilterProductos({ children }: FilterProductosProps) {
  const [filtro, setFiltro] = useState<TipoPieza | null>(null);

  return (
    <div className="wrap">
      <div style={{ marginBottom: "3rem", marginTop: "2rem" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
            Filtrar por tipo:
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <button
              onClick={() => setFiltro(null)}
              style={{
                padding: "0.5rem 1rem",
                border: `1px solid ${filtro === null ? "var(--accent)" : "var(--line)"}`,
                background: filtro === null ? "var(--accent)" : "transparent",
                color: filtro === null ? "var(--bg)" : "var(--fg)",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: filtro === null ? "600" : "400",
                transition: "all 0.3s ease",
                fontFamily: "var(--font-ui), system-ui, sans-serif",
              }}
            >
              Todos
            </button>
            {TIPOS_DISPONIBLES.map((tipo) => (
              <button
                key={tipo}
                onClick={() => setFiltro(tipo)}
                style={{
                  padding: "0.5rem 1rem",
                  border: `1px solid ${filtro === tipo ? "var(--accent)" : "var(--line)"}`,
                  background: filtro === tipo ? "var(--accent)" : "transparent",
                  color: filtro === tipo ? "var(--bg)" : "var(--fg)",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: filtro === tipo ? "600" : "400",
                  transition: "all 0.3s ease",
                  fontFamily: "var(--font-ui), system-ui, sans-serif",
                }}
              >
                {TIPO_LABEL[tipo] || tipo}
              </button>
            ))}
          </div>
        </div>
      </div>

      {children(filtro)}
    </div>
  );
}
