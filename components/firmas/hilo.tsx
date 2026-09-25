"use client";

import { useEffect, useRef } from "react";
import { useMedia } from "@/lib/media";
import s from "./hilo.module.css";

const PUNTOS = 48;
const RIGIDEZ = 0.07;
const AMORTIGUACION = 0.84;

/**
 * Un hilo que cuelga de un extremo al otro. Tiene un poco de peso (`caida`),
 * respira apenas y se deja llevar hacia el cursor cuando pasa cerca, como un
 * hilo de verdad: física de resorte por punto, sin librerías.
 *
 * `caida` en píxeles; en 0 el hilo queda tenso. Con movimiento reducido se
 * dibuja quieto.
 */
export default function Hilo({
  caida = 14,
  alto = 80,
  className,
}: {
  caida?: number;
  alto?: number;
  className?: string;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const trazo = useRef<SVGPathElement>(null);
  const caidaRef = useRef(caida);
  const reducido = useMedia("(prefers-reduced-motion: reduce)");

  // La caída cambia con hover (hilo que se tensa) sin reiniciar la física.
  useEffect(() => {
    caidaRef.current = caida;
  }, [caida]);

  useEffect(() => {
    const el = svg.current;
    const path = trazo.current;
    if (!el || !path) return;

    let ancho = el.clientWidth;
    const medio = alto / 2;
    const y = new Float32Array(PUNTOS).fill(medio);
    const v = new Float32Array(PUNTOS);
    let cursor: { x: number; y: number } | null = null;
    let frame = 0;
    let visible = true;
    let t = 0;

    const reposo = (i: number) => {
      const u = i / (PUNTOS - 1);
      return medio + caidaRef.current * Math.sin(Math.PI * u);
    };

    const dibujar = () => {
      const paso = ancho / (PUNTOS - 1);
      // Catmull-Rom a Bézier: curva suave que pasa por todos los puntos.
      let d = `M0 ${y[0].toFixed(2)}`;
      for (let i = 0; i < PUNTOS - 1; i++) {
        const y0 = y[Math.max(0, i - 1)];
        const y1 = y[i];
        const y2 = y[i + 1];
        const y3 = y[Math.min(PUNTOS - 1, i + 2)];
        const x1 = i * paso;
        const x2 = (i + 1) * paso;
        d += ` C${(x1 + paso / 3).toFixed(1)} ${(y1 + (y2 - y0) / 6).toFixed(2)} ${(x2 - paso / 3).toFixed(1)} ${(y2 - (y3 - y1) / 6).toFixed(2)} ${x2.toFixed(1)} ${y2.toFixed(2)}`;
      }
      path.setAttribute("d", d);
    };

    if (reducido) {
      for (let i = 0; i < PUNTOS; i++) y[i] = reposo(i);
      dibujar();
      return;
    }

    const paso = () => {
      frame = 0;
      if (!visible) return;
      t += 0.012;
      const pasoX = ancho / (PUNTOS - 1);
      for (let i = 1; i < PUNTOS - 1; i++) {
        let objetivo = reposo(i) + Math.sin(t + i * 0.22) * 1.2; // respiración
        if (cursor) {
          const dx = cursor.x - i * pasoX;
          const peso = Math.exp(-(dx * dx) / (2 * 90 * 90));
          objetivo += (cursor.y - objetivo) * peso * 0.55;
        }
        v[i] = (v[i] + (objetivo - y[i]) * RIGIDEZ) * AMORTIGUACION;
        y[i] += v[i];
      }
      dibujar();
      frame = requestAnimationFrame(paso);
    };

    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cy = e.clientY - r.top;
      // Solo cuando el cursor pasa cerca del hilo.
      cursor = cy > -120 && cy < alto + 120 ? { x: e.clientX - r.left, y: Math.max(-40, Math.min(alto + 40, cy)) } : null;
    };
    const medir = () => {
      ancho = el.clientWidth;
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(paso);
    });
    io.observe(el);
    window.addEventListener("pointermove", mover, { passive: true });
    window.addEventListener("resize", medir);
    frame = requestAnimationFrame(paso);

    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("resize", medir);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [alto, reducido]);

  return (
    <svg
      ref={svg}
      className={`${s.hilo} ${className ?? ""}`}
      height={alto}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path ref={trazo} fill="none" />
    </svg>
  );
}
