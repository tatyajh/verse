"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMedia } from "@/lib/media";
import s from "./capitulo-velo.module.css";

/**
 * El capítulo llega cubierto de encaje y se descubre a medida que se lee.
 *
 * La diferencia con «La llave» es deliberada: allí el cursor descubre una
 * figura; aquí hay prosa, y la prosa no puede depender de un efecto. El
 * texto va siempre entero y sin máscara en el DOM. El encaje es una capa
 * hermana, aria-hidden, que solo se renderiza cuando el cliente confirma
 * que puede abrirla. Sin JS, sin soporte de mask o con movimiento
 * reducido, el velo sencillamente no existe.
 */
export default function CapituloVelo({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducido = useMedia("(prefers-reduced-motion: reduce)");
  const fino = useMedia("(pointer: fine)");
  const [velar, setVelar] = useState(false);

  useEffect(() => {
    if (reducido) {
      setVelar(false);
      return;
    }
    setVelar(
      typeof CSS !== "undefined" &&
        (CSS.supports("mask-image", "linear-gradient(#000, #000)") ||
          CSS.supports("-webkit-mask-image", "linear-gradient(#000, #000)")),
    );
  }, [reducido]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !velar) return;

    const abrir = () => el.style.setProperty("--avance", "130%");

    // Failsafe: pase lo que pase con el observador, a los 1200 ms de la
    // primera aparición el velo se retira. Nunca se queda prosa debajo.
    let red: ReturnType<typeof setTimeout> | undefined;

    const io = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.rootBounds) return;
        if (red === undefined) red = setTimeout(abrir, 1200);

        const alto = entrada.rootBounds.height;
        const caja = entrada.boundingClientRect;
        // Cuánto ha recorrido el bloque la pantalla, de 0 a 1. Sirve igual
        // para un capítulo corto que para uno más alto que el viewport.
        const recorrido = (alto - caja.top) / (alto + caja.height);
        const avance = Math.max(0, Math.min(1, recorrido * 1.35));
        el.style.setProperty("--avance", `${(avance * 130).toFixed(1)}%`);
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      if (red !== undefined) clearTimeout(red);
    };
  }, [velar]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !velar || !fino) return;

    // Parallax mínimo sobre la textura: se nota la mano, pero nunca toca
    // la opacidad. La lectura no corre riesgo.
    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const d = ((e.clientX - r.left) / r.width - 0.5) * 8;
      el.style.setProperty("--deriva", `${d.toFixed(1)}px`);
    };
    el.addEventListener("pointermove", mover, { passive: true });
    return () => el.removeEventListener("pointermove", mover);
  }, [velar, fino]);

  return (
    <div ref={ref} className={s.velo} style={velar ? { "--avance": "0%" } as React.CSSProperties : undefined}>
      <div className={s.cuerpo}>{children}</div>
      {velar && <div className={s.encaje} aria-hidden="true" />}
    </div>
  );
}
