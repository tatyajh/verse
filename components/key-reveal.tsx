"use client";

import { useEffect, useRef } from "react";
import { useMedia } from "@/lib/media";
import { VerseMark } from "./verse-mark";
import s from "./key-reveal.module.css";

/**
 * «La llave»: el encaje cubre la pieza y el cursor la descubre.
 *
 * Es el único momento interactivo del sitio y existe porque la marca dice que
 * la llave representa lo que hay detrás de la lencería. Con puntero fino se
 * sigue el cursor; con pantalla táctil el descubierto baja con el scroll; con
 * movimiento reducido se queda quieto en el centro.
 */
export default function KeyReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const reducido = useMedia("(prefers-reduced-motion: reduce)");
  const fino = useMedia("(pointer: fine)");

  const pista = "";

  useEffect(() => {
    const el = ref.current;
    if (!el || reducido) return;

    let frame = 0;
    let px = 50;
    let py = 50;

    const aplicar = () => {
      frame = 0;
      el.style.setProperty("--x", `${px}%`);
      el.style.setProperty("--y", `${py}%`);
    };

    const programar = () => {
      if (frame) return;
      frame = requestAnimationFrame(aplicar);
    };

    if (fino) {
      const mover = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        px = ((e.clientX - r.left) / r.width) * 100;
        py = ((e.clientY - r.top) / r.height) * 100;
        programar();
      };
      const salir = () => {
        px = 50;
        py = 50;
        programar();
      };
      el.addEventListener("pointermove", mover);
      el.addEventListener("pointerleave", salir);
      return () => {
        if (frame) cancelAnimationFrame(frame);
        el.removeEventListener("pointermove", mover);
        el.removeEventListener("pointerleave", salir);
      };
    }

    // Táctil: el descubierto recorre la pieza a medida que entra en pantalla.
    const alDesplazar = () => {
      const r = el.getBoundingClientRect();
      const avance = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      py = Math.min(88, Math.max(12, avance * 100));
      px = 50;
      programar();
    };
    alDesplazar();
    window.addEventListener("scroll", alDesplazar, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", alDesplazar);
    };
  }, [reducido, fino]);

  return (
    <div ref={ref} className={s.figura}>
      <div className={s.fondo}>
        <VerseMark size="42%" />
      </div>
      <div className={s.encaje} />
      <div className={s.filete} />
      {pista && <span className={`${s.pista} label`}>{pista}</span>}
    </div>
  );
}
