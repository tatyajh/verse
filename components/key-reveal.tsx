"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMedia } from "@/lib/media";
import { VerseMark } from "./verse-mark";
import SedaPixi from "./seda-pixi";
import s from "./key-reveal.module.css";

/**
 * «La llave»: el encaje cubre la foto y el cursor la descubre. Es el único
 * gesto animado de la portada.
 *
 * Con puntero fino sigue el cursor; en pantalla táctil el descubierto baja
 * con el scroll; con movimiento reducido queda quieto en el centro. Sin foto,
 * debajo del encaje está el emblema.
 */
export default function KeyReveal({ foto }: { foto?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducido = useMedia("(prefers-reduced-motion: reduce)");
  const fino = useMedia("(pointer: fine)");
  // Con PixiJS la foto ondula como seda; mientras carga (o si no hay WebGL)
  // se ve la <Image> normal.
  const [seda, setSeda] = useState(false);
  const alListo = useCallback(() => setSeda(true), []);

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
        {foto ? (
          <Image
            src={foto}
            alt=""
            fill
            priority
            sizes="(max-width: 860px) 90vw, 40vw"
            className={`${s.foto} ${seda ? s.oculta : ""}`}
          />
        ) : (
          <VerseMark size="42%" />
        )}
      </div>
      {foto && !reducido && <SedaPixi foto={foto} onListo={alListo} />}
      <div className={s.encaje} />
      <div className={s.filete} />
    </div>
  );
}
