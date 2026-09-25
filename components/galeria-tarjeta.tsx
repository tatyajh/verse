"use client";

import { useState } from "react";
import ProductImage from "./product-image";
import type { Product } from "@/lib/products";
import s from "./galeria-tarjeta.module.css";

/**
 * Foto de la tarjeta con miniaturas debajo: el conjunto y cada prenda que lo
 * forma. Elegir una miniatura cambia la foto sin salir de la tienda; el
 * enlace de la tarjeta sigue llevando a la ficha del conjunto.
 */
export default function GaleriaTarjeta({
  items,
  sizes,
  claseMarco,
}: {
  items: Product[];
  sizes?: string;
  claseMarco: string;
}) {
  const [activa, setActiva] = useState(0);
  const actual = items[activa];

  return (
    <>
      <div className={claseMarco}>
        <ProductImage key={actual.slug} producto={actual} sizes={sizes} />
      </div>
      <div className={s.miniaturas} role="group" aria-label="Prendas del conjunto">
        {items.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            className={`${s.miniatura} ${i === activa ? s.activa : ""}`}
            onClick={() => setActiva(i)}
            aria-pressed={i === activa}
            aria-label={i === 0 ? "Ver el conjunto" : `Ver ${p.nombre}`}
            title={i === 0 ? "Conjunto" : p.nombre}
          >
            <ProductImage producto={p} sizes="48px" />
          </button>
        ))}
      </div>
    </>
  );
}
