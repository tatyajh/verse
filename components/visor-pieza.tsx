"use client";

import { useCallback, useRef, useState } from "react";
import ProductImage from "./product-image";
import Comprar from "./comprar";
import type { Product } from "@/lib/products";
import s from "./visor-pieza.module.css";

const PIXELES_POR_CUADRO = 10;

/**
 * El cuadro de la pieza y la compra, juntos en un solo bloque sticky: se
 * gira (cuando hay fotos para eso) y se compra sin salir de ahí.
 *
 * Todavía ninguna pieza trae `giro` (la secuencia de fotos para el 360°),
 * así que hoy este componente se ve igual que la imagen fija de siempre.
 * El día que Versé tenga esas fotos, basta con agregar `giro: [...]` en
 * products.ts — nada más cambia.
 */
export default function VisorPieza({
  producto,
  sizes,
}: {
  producto: Product;
  sizes?: string;
}) {
  const giro = producto.giro && producto.giro.length > 1 ? producto.giro : null;
  const [cuadro, setCuadro] = useState(0);
  const arrastre = useRef<{ x: number; cuadro: number } | null>(null);

  const irA = useCallback(
    (n: number) => {
      if (!giro) return;
      const total = giro.length;
      setCuadro(((n % total) + total) % total);
    },
    [giro],
  );

  const alBajarPuntero = (e: React.PointerEvent) => {
    if (!giro) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    arrastre.current = { x: e.clientX, cuadro };
  };

  const alMoverPuntero = (e: React.PointerEvent) => {
    if (!giro || !arrastre.current) return;
    const delta = e.clientX - arrastre.current.x;
    irA(arrastre.current.cuadro - Math.round(delta / PIXELES_POR_CUADRO));
  };

  const alSoltarPuntero = () => {
    arrastre.current = null;
  };

  const alTeclado = (e: React.KeyboardEvent) => {
    if (!giro) return;
    if (e.key === "ArrowLeft") irA(cuadro - 1);
    if (e.key === "ArrowRight") irA(cuadro + 1);
  };

  return (
    <div className={s.visor}>
      <div
        className={`${s.cuadro} ${giro ? s.giro : ""}`}
        onPointerDown={alBajarPuntero}
        onPointerMove={alMoverPuntero}
        onPointerUp={alSoltarPuntero}
        onPointerCancel={alSoltarPuntero}
        onKeyDown={alTeclado}
        tabIndex={giro ? 0 : undefined}
        role={giro ? "img" : undefined}
        aria-label={giro ? `${producto.nombre} — arrastra o usa las flechas para girar` : undefined}
      >
        {giro ? (
          // eslint-disable-next-line @next/next/no-img-element -- secuencia local, no next/image
          <img src={giro[cuadro]} alt="" draggable={false} />
        ) : (
          <ProductImage producto={producto} priority sizes={sizes} />
        )}

        {giro && (
          <>
            <span className={`${s.pista} label`}>Arrastra para girar</span>
            <span className={s.aros} aria-hidden="true">
              {giro.map((_, i) => (
                <span key={i} className={`${s.aro} ${i === cuadro ? s.aroActivo : ""}`} />
              ))}
            </span>
          </>
        )}
      </div>

      {producto.precio !== undefined ? (
        <Comprar producto={producto} />
      ) : (
        <p className={`${s.proximamente} label`}>Todavía no está a la venta.</p>
      )}
    </div>
  );
}
