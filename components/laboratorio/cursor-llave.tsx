"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMedia } from "@/lib/media";
import s from "./cursor-llave.module.css";

/**
 * Dentro de esta zona el cursor es la llave del logo (completa, tal cual).
 * La punta de la llave es el punto que señala. Al pasar sobre algo que se
 * puede abrir —un enlace o un botón— la llave gira sobre su eje, como dentro
 * de una cerradura.
 *
 * Solo con mouse; en pantallas táctiles o con movimiento reducido se queda el
 * cursor normal.
 */
export default function CursorLlave({ children }: { children: ReactNode }) {
  const zona = useRef<HTMLDivElement>(null);
  const llave = useRef<HTMLDivElement>(null);
  const fino = useMedia("(hover: hover) and (pointer: fine)");
  const reducido = useMedia("(prefers-reduced-motion: reduce)");
  const activo = fino && !reducido;

  useEffect(() => {
    const el = zona.current;
    const k = llave.current;
    if (!el || !k || !activo) return;

    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let frame = 0;

    const seguir = () => {
      // La llave va un paso detrás del puntero: tiene peso.
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      k.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? requestAnimationFrame(seguir) : 0;
    };

    const mover = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const sobre = (e.target as Element | null)?.closest("a, button, [data-abre]");
      k.dataset.gira = sobre ? "si" : "";
      k.dataset.visible = "si";
      if (!frame) frame = requestAnimationFrame(seguir);
    };
    const salir = () => {
      k.dataset.visible = "";
    };

    el.addEventListener("pointermove", mover);
    el.addEventListener("pointerleave", salir);
    return () => {
      el.removeEventListener("pointermove", mover);
      el.removeEventListener("pointerleave", salir);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [activo]);

  return (
    <div ref={zona} className={activo ? s.zona : undefined}>
      {children}
      {activo && (
        <div ref={llave} className={s.llave} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/verse-mark.svg" alt="" className={s.imagen} />
        </div>
      )}
    </div>
  );
}
