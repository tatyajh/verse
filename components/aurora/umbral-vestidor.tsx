"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import LaceCanvas from "../lace-canvas";
import { getTonalidad, type Tonalidad } from "@/lib/products";
import { hexALab } from "@/lib/cielo";
import s from "./umbral-vestidor.module.css";

/**
 * Enlace al final de cada capítulo que lleva a las piezas de ese momento.
 *
 * La rendija de luz se abre al entrar en pantalla (igual que <Seam/>, con un
 * atributo en el DOM y no con estado). Es decorativa y va aria-hidden.
 */
export default function UmbralVestidor({ momento }: { momento: Tonalidad }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const tonalidad = getTonalidad(momento);

  // Sobre grabados claros (Borealis, Prima Luce) el texto va oscuro. Se
  // decide por la luminosidad del fondo, no por una lista de momentos.
  const fondoL = hexALab(tonalidad.grabado.fondo)[0];
  const claro = fondoL > 0.6;

  // La rendija usa el color de la paleta con más contraste contra el fondo.
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
      href={`/aurora?view=productos&momento=${momento}`}
      prefetch
      className={s.umbral}
      // El enlace con texto es el de debajo («Ver las piezas de…»); este es
      // la misma puerta en imagen, así que no se repite para teclado ni lector.
      tabIndex={-1}
      aria-hidden="true"
      data-claro={claro ? "si" : undefined}
      style={{ "--luz": luz } as React.CSSProperties}
    >
      <LaceCanvas slug={`umbral-${momento}`} paleta={tonalidad.grabado} />
      <span className={s.rendija} aria-hidden="true" />
    </Link>
  );
}
