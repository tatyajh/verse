"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { useMedia } from "@/lib/media";
import s from "./capitulo-velo.module.css";

/**
 * Capa de encaje sobre el texto de cada capítulo que se retira con el scroll.
 *
 * El texto siempre está completo en el DOM; el encaje es una capa hermana
 * aria-hidden. Sin JS, sin soporte de mask-image o con movimiento reducido,
 * la capa no se dibuja.
 */
// El soporte de mask-image no cambia durante la visita: no hay a qué suscribirse.
const sinCambios = () => () => {};

function soportaMascara(): boolean {
  return (
    CSS.supports("mask-image", "linear-gradient(#000, #000)") ||
    CSS.supports("-webkit-mask-image", "linear-gradient(#000, #000)")
  );
}

export default function CapituloVelo({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducido = useMedia("(prefers-reduced-motion: reduce)");
  const fino = useMedia("(pointer: fine)");
  const conMascara = useSyncExternalStore(sinCambios, soportaMascara, () => false);
  const velar = conMascara && !reducido;

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
