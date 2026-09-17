"use client";

import { useEffect, useRef } from "react";
import { useMedia } from "@/lib/media";
import { suscribir } from "@/lib/progreso";
import {
  alturaCinta,
  cieloEn,
  cintas as generarCintas,
  colorCintaEn,
  intensidadEn,
  type Cinta,
} from "@/lib/cielo";
import s from "./cielo-aurora.module.css";

/** Por debajo de esto la aurora no se ve: Noctis no cuesta un solo píxel. */
const UMBRAL = 0.04;

/** Muestras por cinta. 48 basta: son curvas suaves, no hairlines. */
const N = 48;

/** Halo → núcleo. Tres pasadas en «lighter» sustituyen al blur, que frita la batería. */
const PASADAS: [number, number][] = [
  [2.4, 0.12],
  [1.5, 0.2],
  [1, 0.38],
];

export default function CieloAurora() {
  const raiz = useRef<HTMLDivElement>(null);
  const lienzo = useRef<HTMLCanvasElement>(null);
  const reducido = useMedia("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    const caja = raiz.current;
    if (!caja) return;

    // Con movimiento reducido el canvas ni se monta: no es una aurora
    // apagada, es otro camino. Queda el gradiente, que sigue al scroll —
    // lo mueve la mano de quien lee, no la página.
    const canvas = reducido ? null : lienzo.current;
    const ctx = canvas?.getContext("2d", { alpha: true }) ?? null;

    const modesto =
      typeof navigator !== "undefined" &&
      ((navigator.hardwareConcurrency ?? 8) <= 4 || window.innerWidth < 720);

    const cintas: Cinta[] = generarCintas(modesto ? 2 : 4);
    const escala = Math.min(window.devicePixelRatio || 1, 2) * 0.5;

    let ancho = 0;
    let altoPx = 0;
    let ultimoColor = -1;
    let salto = false;

    const medir = () => {
      if (!canvas) return;
      const w = Math.round(window.innerWidth * escala);
      const h = Math.round(window.innerHeight * escala);
      // La barra de URL del móvil dispara resizes de pocos píxeles al
      // desplazarse; reasignar el búfer en cada uno lo borra y parpadea.
      if (Math.abs(w - ancho) < 4 && Math.abs(h - altoPx) < 4) return;
      ancho = canvas.width = w;
      altoPx = canvas.height = h;
    };

    medir();
    window.addEventListener("resize", medir);

    const pintar = (avance: number, tiempo: number) => {
      // El color solo se recalcula cuando el avance se mueve de verdad.
      const paso = Math.round(avance * 512);
      if (paso !== ultimoColor) {
        ultimoColor = paso;
        const paradas = cieloEn(avance);
        for (let i = 0; i < paradas.length; i++) {
          caja.style.setProperty(`--c${i}`, paradas[i]);
        }
      }

      if (!ctx || !canvas) return;

      if (modesto) {
        salto = !salto;
        if (salto) return; // 30 fps en equipos modestos
      }

      const intensidad = intensidadEn(avance);
      ctx.clearRect(0, 0, ancho, altoPx);
      if (intensidad < UMBRAL) return;

      const { nucleo, pie } = colorCintaEn(avance);
      ctx.globalCompositeOperation = "lighter";

      for (const c of cintas) {
        const arriba = c.base * altoPx;
        const g = ctx.createLinearGradient(0, arriba, 0, arriba + c.alto * altoPx * 2.4);
        // Verde arriba, violeta abajo: «Verdes. Violetas.» El pie no se
        // apaga de golpe, se deja ver antes de disolverse.
        g.addColorStop(0, `rgb(${nucleo} / 0)`);
        g.addColorStop(0.3, `rgb(${nucleo})`);
        g.addColorStop(0.62, `rgb(${pie} / 0.55)`);
        g.addColorStop(1, `rgb(${pie} / 0)`);
        ctx.fillStyle = g;

        for (const [grosor, alfa] of PASADAS) {
          ctx.globalAlpha = alfa * intensidad;
          ctx.beginPath();
          for (let i = 0; i <= N; i++) {
            const x = i / N;
            ctx.lineTo(x * ancho, alturaCinta(c, x, tiempo) * altoPx);
          }
          for (let i = N; i >= 0; i--) {
            const x = i / N;
            ctx.lineTo(
              x * ancho,
              (alturaCinta(c, x, tiempo) + c.alto * grosor) * altoPx,
            );
          }
          ctx.closePath();
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const cancelar = suscribir(pintar);
    return () => {
      cancelar();
      window.removeEventListener("resize", medir);
    };
  }, [reducido]);

  return (
    <div ref={raiz} className={s.cielo} aria-hidden="true">
      <div className={s.fondo} />
      {!reducido && <canvas ref={lienzo} className={s.cintas} />}
      <div className={s.nieve} />
    </div>
  );
}
