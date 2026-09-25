"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMedia } from "@/lib/media";
import { VerseMark } from "./verse-mark";
import SedaPixi from "./seda-pixi";
import s from "./key-reveal.module.css";

/**
 * «La llave»: la foto en el espejo, cubierta por el velo de encaje, y encima
 * la llave del logo. Donde está la llave el velo se abre; al moverla con el
 * mouse o el dedo va dejando huecos por los que se ve la foto, que se cierran
 * solos.
 *
 * En pantalla táctil, hasta que la toquen, la llave baja con el scroll. Con
 * movimiento reducido queda quieta en el centro. Sin foto, debajo del encaje
 * está el emblema.
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
    // El rastro: por donde pasó la llave el velo queda abierto un momento y
    // se va cerrando solo. Cada punto es un hueco que encoge.
    let rastro: { x: number; y: number; r: number }[] = [];

    const hueco = (x: number, y: number, r: number) =>
      `radial-gradient(circle at ${x.toFixed(1)}% ${y.toFixed(1)}%, transparent 0, transparent ${r.toFixed(1)}%, #000 ${(r + 14).toFixed(1)}%)`;

    const dibujar = () => {
      frame = 0;
      rastro = rastro
        .map((p) => ({ ...p, r: p.r * 0.94 - 0.15 }))
        .filter((p) => p.r > 0.5);
      el.style.setProperty("--x", `${px}%`);
      el.style.setProperty("--y", `${py}%`);
      // El hueco de la llave siempre, más los del rastro. Se combinan por
      // intersección: el velo solo queda donde ningún hueco lo abre.
      const capas = [hueco(px, py, 13), ...rastro.map((p) => hueco(p.x, p.y, p.r))];
      el.style.setProperty("--velo", capas.join(", "));
      if (rastro.length) frame = requestAnimationFrame(dibujar);
    };

    const programar = () => {
      if (!frame) frame = requestAnimationFrame(dibujar);
    };

    // La llave se mueve con el mouse y con el dedo (de lado; en vertical el
    // dedo sigue haciendo scroll).
    let anteriorX = px;
    let tocada = false;
    const mover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") tocada = true;
      const r = el.getBoundingClientRect();
      const nx = Math.min(92, Math.max(8, ((e.clientX - r.left) / r.width) * 100));
      const ny = Math.min(90, Math.max(10, ((e.clientY - r.top) / r.height) * 100));
      // Deja un hueco cada tanto, no en cada evento, para no cargar la máscara.
      const ultimo = rastro[rastro.length - 1];
      if (!ultimo || Math.hypot(nx - ultimo.x, ny - ultimo.y) > 4) {
        rastro.push({ x: px, y: py, r: 12 });
        if (rastro.length > 14) rastro.shift();
      }
      px = nx;
      py = ny;
      // Se inclina hacia donde va, como si colgara.
      const giro = Math.max(-14, Math.min(14, (px - anteriorX) * 1.6));
      anteriorX = px;
      el.style.setProperty("--giro", `${giro.toFixed(1)}deg`);
      programar();
    };
    const soltar = () => {
      el.style.setProperty("--giro", "0deg");
    };
    el.addEventListener("pointermove", mover);
    el.addEventListener("pointerdown", mover);
    el.addEventListener("pointerleave", soltar);

    // En pantallas táctiles, mientras no la toquen, la llave recorre la
    // foto con el scroll.
    const alDesplazar = () => {
      if (fino || tocada) return;
      const r = el.getBoundingClientRect();
      const avance = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      py = Math.min(80, Math.max(20, avance * 100));
      px = 50;
      programar();
    };
    alDesplazar();
    programar();
    window.addEventListener("scroll", alDesplazar, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", mover);
      el.removeEventListener("pointerdown", mover);
      el.removeEventListener("pointerleave", soltar);
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
      {/* La llave del logo (sin la cápsula) encima del velo: es la que lo abre. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/verse-llave-hero.svg" alt="" aria-hidden="true" className={s.llave} />
      <div className={s.filete} />
    </div>
  );
}
