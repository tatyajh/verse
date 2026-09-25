"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import s from "./lace-canvas.module.css";
import { prng, semilla } from "@/lib/azar";

/**
 * Grabado de encaje generativo.
 *
 * Reemplaza la foto de producto mientras no exista. Cada pieza recibe un
 * grabado propio, sembrado con su slug (idéntico entre recargas), con
 * festón, arcos de cerradura y retícula de tul sobre un fondo de dos tonos.
 *
 * La paleta por defecto es la noche del sitio. Aurora trae las suyas
 * propias (ver lib/products.ts) para que cada momento se distinga
 * aun sin foto.
 *
 * Cuando existan fotos, <ProductImage> usa la foto y esto desaparece solo.
 */

export type PaletaGrabado = {
  fondo: string;
  fondo2: string;
  /** "r, g, b" — el trazo del encaje. */
  trazo: string;
  /** "r, g, b" — hacia dónde cierra la viñeta de los bordes. */
  vineta: string;
};

export const PALETA_NOCHE: PaletaGrabado = {
  fondo: "#060608",
  fondo2: "#15141b",
  trazo: "201, 143, 111",
  vineta: "20, 14, 14",
};

/** Noche Boreal / Petróleo Aurora / Violeta Pulsar — del moodboard de Aurora. */
export const PALETA_AURORA_NOCTURNA: PaletaGrabado = {
  fondo: "#080d18",
  fondo2: "#12484b",
  trazo: "138, 111, 158",
  vineta: "8, 13, 24",
};

/** Crema Lunar / Lila Celestial, con el trazo en Morado Abismo para contraste. */
export const PALETA_AURORA_DIURNA: PaletaGrabado = {
  fondo: "#f4eee5",
  fondo2: "#c7b8cd",
  trazo: "43, 28, 61",
  vineta: "199, 184, 205",
};

function dibujar(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  slug: string,
  paleta: PaletaGrabado,
) {
  const r = prng(semilla(slug));
  const min = Math.min(w, h);
  const trazo = paleta.trazo;

  ctx.clearRect(0, 0, w, h);

  // Fondo: dos tonos con una veladura hacia el centro alto, como luz rasante.
  const fondo = ctx.createLinearGradient(0, 0, w * 0.4, h);
  fondo.addColorStop(0, paleta.fondo2);
  fondo.addColorStop(1, paleta.fondo);
  ctx.fillStyle = fondo;
  ctx.fillRect(0, 0, w, h);

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(0.6, min * 0.0016);

  // --- retícula de tul: dos familias de líneas cruzadas, casi invisibles ---
  const paso = min * (0.028 + r() * 0.014);
  const giro = (12 + r() * 22) * (Math.PI / 180);
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(giro);
  ctx.strokeStyle = `rgba(${trazo}, 0.075)`;
  const alcance = Math.hypot(w, h);
  ctx.beginPath();
  for (let x = -alcance; x <= alcance; x += paso) {
    ctx.moveTo(x, -alcance);
    ctx.lineTo(x, alcance);
  }
  ctx.stroke();
  ctx.beginPath();
  for (let y = -alcance; y <= alcance; y += paso * 1.9) {
    ctx.moveTo(-alcance, y);
    ctx.lineTo(alcance, y);
  }
  ctx.stroke();
  ctx.restore();

  // --- festón: arcos colgantes en tres alturas, como borde de encaje ---
  const alturas = [0.6, 0.71, 0.83];
  alturas.forEach((f, i) => {
    const y = h * f;
    const radio = w / (7 + Math.floor(r() * 5));
    ctx.strokeStyle = `rgba(${trazo}, ${0.34 - i * 0.07})`;
    ctx.beginPath();
    for (let x = -radio; x < w + radio; x += radio * 2) {
      ctx.moveTo(x, y);
      ctx.arc(x + radio, y, radio, Math.PI, 0, true);
    }
    ctx.stroke();

    // Puntos de picot colgando de cada valle.
    ctx.fillStyle = `rgba(${trazo}, ${0.3 - i * 0.08})`;
    for (let x = radio; x < w; x += radio * 2) {
      ctx.beginPath();
      ctx.arc(x, y + radio * 0.34, ctx.lineWidth * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // --- cerradura: arcos concéntricos con la forma del emblema y, al centro,
  //     el ojo de una cerradura. Geométrico a propósito: nada floral. ---
  const cx = w * (0.42 + r() * 0.16);
  const cy = h * (0.34 + r() * 0.08);
  const coronas = [0.11, 0.17, 0.235, 0.3];

  coronas.forEach((k, i) => {
    const ancho = min * k;
    const alto = ancho * (1.5 + r() * 0.15);
    ctx.strokeStyle = `rgba(${trazo}, ${0.5 - i * 0.1})`;
    ctx.beginPath();
    // Arco de medio punto sobre dos rectas, como el marco del emblema.
    ctx.moveTo(cx - ancho, cy + alto * 0.55);
    ctx.lineTo(cx - ancho, cy - alto * 0.15);
    ctx.arc(cx, cy - alto * 0.15, ancho, Math.PI, 0);
    ctx.lineTo(cx + ancho, cy + alto * 0.55);
    ctx.stroke();
  });

  // Ojo de la cerradura.
  const ojo = min * 0.03;
  ctx.strokeStyle = `rgba(${trazo}, 0.62)`;
  ctx.beginPath();
  ctx.arc(cx, cy - ojo * 0.4, ojo, Math.PI * 0.72, Math.PI * 2.28);
  ctx.lineTo(cx + ojo * 0.55, cy + ojo * 2.2);
  ctx.lineTo(cx - ojo * 0.55, cy + ojo * 2.2);
  ctx.closePath();
  ctx.stroke();

  // --- viñeta: cierra los bordes para que el grabado no se corte en seco ---
  const vineta = ctx.createRadialGradient(
    cx,
    cy,
    min * 0.1,
    w / 2,
    h / 2,
    Math.hypot(w, h) * 0.62,
  );
  vineta.addColorStop(0, `rgba(${paleta.vineta}, 0)`);
  vineta.addColorStop(1, `rgba(${paleta.vineta}, 0.92)`);
  ctx.fillStyle = vineta;
  ctx.fillRect(0, 0, w, h);
}

export default function LaceCanvas({
  slug,
  paleta = PALETA_NOCHE,
  className,
}: {
  slug: string;
  paleta?: PaletaGrabado;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const lienzo = ref.current;
    if (!lienzo) return;
    const ctx = lienzo.getContext("2d");
    if (!ctx) return;

    let frame = 0;

    const pintar = () => {
      frame = 0;
      const { width, height } = lienzo.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      lienzo.width = Math.round(width * dpr);
      lienzo.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dibujar(ctx, width, height, slug, paleta);
    };

    const reprogramar = () => {
      if (frame) return;
      frame = requestAnimationFrame(pintar);
    };

    pintar();
    const ro = new ResizeObserver(reprogramar);
    ro.observe(lienzo);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [slug, paleta]);

  return (
    // El filete interior va en CSS (::after) y no en el canvas: así hereda
    // el radio del contenedor y sigue su curva, sea arco o cápsula.
    <div
      className={`${s.grabado} ${className ?? ""}`}
      style={{ "--trazo": paleta.trazo } as CSSProperties}
    >
      <canvas
        ref={ref}
        aria-hidden="true"
        // color de fondo inmediato: evita el parpadeo antes de que pinte el canvas
        style={{ background: paleta.fondo }}
      />
    </div>
  );
}
