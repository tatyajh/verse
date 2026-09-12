"use client";

import { useState } from "react";
import type { Modo } from "@/lib/products";
import s from "./modos-pieza.module.css";

/**
 * Una pieza, dos maneras de sentirla. No son variantes que se compren
 * distinto —misma prenda, mismo precio, mismas tallas—, son dos estados de
 * ánimo. Por eso el toggle y no una tarjeta explicando cada uno: se elige
 * un modo como se elige cómo se siente una hoy.
 */
export default function ModosPieza({ modos }: { modos: Modo[] }) {
  const [activo, setActivo] = useState(0);
  const modo = modos[activo];

  return (
    <div className={s.bloque}>
      <h2 className={s.titulo}>La misma pieza, dos maneras de sentirla.</h2>

      <div className={`${s.toggle} label`} role="tablist">
        {modos.map((m, i) => (
          <button
            key={m.nombre}
            type="button"
            role="tab"
            aria-selected={i === activo}
            className={i === activo ? s.activo : ""}
            onClick={() => setActivo(i)}
          >
            {m.nombre}
          </button>
        ))}
      </div>

      <p className={s.sensacion}>{modo.sensacion}.</p>

      <div className={s.colores}>
        {modo.colores.map((c) => (
          <div key={c.hex} className={s.color}>
            <span className={s.chip} style={{ background: c.hex }} aria-hidden="true" />
            <span className={s.nombre}>
              {c.nombre}
              <br />
              <span className={`${s.hex} num`}>{c.hex}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
