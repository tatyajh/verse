"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import ProductImage from "./product-image";
import Comprar from "./comprar";
import type { Product } from "@/lib/products";
import { formatCOP } from "@/lib/money";
import ListaPrivada from "./lista-privada";
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
  galeria,
}: {
  producto: Product;
  sizes?: string;
  /** Conjunto y sus prendas: miniaturas bajo la foto principal. */
  galeria?: Product[];
}) {
  const conGaleria = galeria && galeria.length > 1 ? galeria : null;
  const [activa, setActiva] = useState(0);
  const enFoto = conGaleria ? conGaleria[activa] : producto;
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
          <ProductImage key={enFoto.slug} producto={enFoto} priority sizes={sizes} />
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

      {conGaleria && (
        <div className={s.galeria}>
          <div className={s.miniaturas} role="group" aria-label="Prendas del conjunto">
            {conGaleria.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                className={`${s.miniatura} ${i === activa ? s.miniaturaActiva : ""}`}
                onClick={() => setActiva(i)}
                aria-pressed={i === activa}
                aria-label={i === 0 ? "Ver el conjunto" : `Ver ${p.nombre}`}
              >
                <ProductImage producto={p} sizes="80px" />
              </button>
            ))}
          </div>
          {/* Al elegir una prenda: qué es y cómo comprarla sola. */}
          {activa > 0 ? (
            <p className={s.prenda}>
              <span>
                {enFoto.nombre}
                {enFoto.precio !== undefined && `, ${formatCOP(enFoto.precio)}`}
              </span>
              <Link href={`/producto/${enFoto.slug}`} className="link">
                Comprar por separado
              </Link>
            </p>
          ) : (
            <p className={s.prenda}>
              <span>El conjunto completo. Cada prenda se vende también por separado.</span>
            </p>
          )}
        </div>
      )}

      {producto.precio !== undefined ? (
        <Comprar producto={producto} />
      ) : (
        <div className={s.proximamente}>
          <p>Todavía no está a la venta. Deja tu correo y te avisamos cuando salga.</p>
          <ListaPrivada pieza={producto.slug} boton="Avísame" />
        </div>
      )}
    </div>
  );
}
