"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import LaceCanvas from "../lace-canvas";
import { getTonalidad, type Tonalidad } from "@/lib/products";
import { hexALab } from "@/lib/cielo";
import s from "./umbral-vestidor.module.css";

/**
 * El final de cada capítulo es una puerta, no un botón.
 *
 * Aquí la historia deja de ser una página «sobre nosotras» y se convierte
 * en el vestidor: se sale del relato directo a las piezas de ese momento.
 *
 * La rendija de luz se abre al entrar en pantalla —misma mano que <Seam/>:
 * la clase se pone sobre el DOM, no con estado—. Es decoración pura y va
 * aria-hidden; el enlace funciona igual sin ella.
 */
export default function UmbralVestidor({ momento }: { momento: Tonalidad }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const tonalidad = getTonalidad(momento);

  // El grabado de Alba y Amanecer es crema: encima, un texto claro y una
  // rendija pálida desaparecen. Se decide por la luminosidad real del
  // fondo, no por una lista de momentos que habría que mantener a mano.
  const fondoL = hexALab(tonalidad.grabado.fondo)[0];
  const claro = fondoL > 0.6;

  // La rendija toma el tono de la paleta que más se separa del fondo:
  // es una línea de luz, y tiene que verse.
  const luz =
    tonalidad.paleta
      .map((c) => ({ hex: c.hex, d: Math.abs(hexALab(c.hex)[0] - fondoL) }))
      .sort((a, b) => b.d - a.d)[0]?.hex ?? "#e9e3db";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      el.dataset.abierto = "si";
      return;
    }

    const io = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        (entrada.target as HTMLElement).dataset.abierto = "si";
        io.disconnect();
      },
      { rootMargin: "0px 0px -18% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Link
      ref={ref}
      href={`/aurora?momento=${momento}`}
      prefetch
      className={s.umbral}
      data-claro={claro ? "si" : undefined}
      style={{ "--luz": luz } as React.CSSProperties}
    >
      <LaceCanvas slug={`umbral-${momento}`} paleta={tonalidad.grabado} />
      <span className={s.rendija} aria-hidden="true" />
      <span className={`${s.pie} label`}>
        <span>Las piezas de esta noche</span>
        <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
