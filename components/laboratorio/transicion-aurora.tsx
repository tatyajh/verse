"use client";

import { useEffect, useRef, useState } from "react";
import { cieloEn } from "@/lib/cielo";
import { TONALIDADES } from "@/lib/products";
import s from "./transicion-aurora.module.css";

/**
 * Aurora como luz, no como bloques: mientras se baja, el fondo recorre los
 * cuatro cielos (los mismos de la historia) y el nombre del momento cambia
 * en el centro. Con movimiento reducido se ven los cuatro en fila.
 */
export default function TransicionAurora() {
  const ref = useRef<HTMLElement>(null);
  const fondo = useRef<HTMLDivElement>(null);
  const [momento, setMomento] = useState(0);

  useEffect(() => {
    const el = ref.current;
    const f = fondo.current;
    if (!el || !f) return;
    let frame = 0;

    const medir = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const recorrido = r.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / recorrido));
      const [a, b, c, d] = cieloEn(p);
      f.style.background = `linear-gradient(180deg, ${a} 0%, ${b} 40%, ${c} 75%, ${d} 100%)`;
      setMomento(Math.min(3, Math.floor(p * 4)));
    };
    const alDesplazar = () => {
      if (!frame) frame = requestAnimationFrame(medir);
    };

    medir();
    window.addEventListener("scroll", alDesplazar, { passive: true });
    window.addEventListener("resize", alDesplazar);
    return () => {
      window.removeEventListener("scroll", alDesplazar);
      window.removeEventListener("resize", alDesplazar);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const claro = momento === 3;

  return (
    <section ref={ref} className={s.recorrido}>
      <div ref={fondo} className={s.cielo}>
        <div className={s.grano} aria-hidden="true" />
        {TONALIDADES.map((t, i) => (
          <div
            key={t.id}
            className={`${s.momento} ${i === momento ? s.visible : ""}`}
            style={{ color: claro ? "#2a1a3f" : "#f1eef0" }}
            aria-hidden={i !== momento}
          >
            <p className={s.nombre}>{t.nombre}</p>
            <p className={s.sensacion}>{t.sensacion}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
