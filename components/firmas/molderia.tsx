"use client";

import { useEffect, useRef, useState } from "react";
import s from "./molderia.module.css";

/**
 * El lenguaje del patronaje como fondo: una copa y un delantero de panty con
 * su margen de costura, piquetes, línea de hilo recto y medidas reales. Se
 * dibuja una sola vez, al entrar en pantalla; después queda quieto.
 */
export default function Molderia({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [dibujada, setDibujada] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDibujada(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 900 520"
      className={`${s.molde} ${dibujada ? s.dibujada : ""} ${className ?? ""}`}
      aria-hidden="true"
    >
      {/* Copa: pieza, margen de costura y línea de hilo. */}
      <g>
        <path
          className={s.linea}
          pathLength={1}
          d="M110 370 C112 230 240 138 352 146 C418 151 448 228 438 300 C428 366 336 406 244 404 C176 402 114 396 110 370 Z"
        />
        <path
          className={`${s.linea} ${s.margen}`}
          pathLength={1}
          d="M92 378 C94 220 232 120 354 128 C432 134 468 222 456 304 C444 380 344 424 244 422 C168 420 96 412 92 378 Z"
        />
        <path className={s.linea} pathLength={1} d="M272 190 L272 360" />
        <path className={s.linea} pathLength={1} d="M264 202 L272 188 L280 202 M264 348 L272 362 L280 348" />
        {/* Piquetes */}
        <path className={s.linea} pathLength={1} d="M352 146 L352 128 M438 300 L456 302 M176 402 L174 420" />
        <text x="248" y="280" className={s.nota} transform="rotate(-90 248 280)">
          hilo recto
        </text>
        <text x="130" y="455" className={s.nota}>
          copa, busto 84–88 cm
        </text>
      </g>

      {/* Delantero de panty. */}
      <g>
        <path
          className={s.linea}
          pathLength={1}
          d="M560 150 L800 150 C792 228 760 286 716 318 C704 360 700 404 700 440 L662 440 C662 404 656 360 644 318 C600 286 568 228 560 150 Z"
        />
        <path
          className={`${s.linea} ${s.margen}`}
          pathLength={1}
          d="M542 132 L818 132 C810 234 776 298 732 330 C720 370 718 410 718 458 L644 458 C644 410 640 370 628 330 C584 298 550 234 542 132 Z"
        />
        <path className={s.linea} pathLength={1} d="M680 176 L680 300" />
        <path className={s.linea} pathLength={1} d="M672 188 L680 174 L688 188 M672 288 L680 302 L688 288" />
        <text x="566" y="495" className={s.nota}>
          delantero, cadera 90–95 cm
        </text>
      </g>

      {/* Marcas de trazo: cruces de referencia. */}
      {[
        [110, 370],
        [352, 146],
        [560, 150],
        [800, 150],
        [700, 440],
      ].map(([x, y]) => (
        <path
          key={`${x}-${y}`}
          className={s.linea}
          pathLength={1}
          d={`M${x - 7} ${y} L${x + 7} ${y} M${x} ${y - 7} L${x} ${y + 7}`}
        />
      ))}
    </svg>
  );
}
