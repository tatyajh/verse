"use client";

import Link from "next/link";
import ProductCard from "./product-card";
import { useFavoritos } from "@/lib/favoritos";
import s from "@/app/favoritos/favoritos.module.css";

export default function FavoritosCliente() {
  const { listo, piezas } = useFavoritos();

  // Mientras React hidrata no se sabe qué guardó: mejor nada que un falso vacío.
  if (!listo) return null;

  if (piezas.length === 0) {
    return (
      <div className={s.vacio}>
        <p>
          Todavía no has guardado ninguna pieza. Toca el corazón en cualquiera que
          te llame y la encuentras aquí cuando vuelvas.
        </p>
        <Link href="/aurora?view=productos&momento=noctis" className="btn">
          Ver Aurora Versé
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className={s.rejilla}>
        {piezas.map((p) => (
          <ProductCard
            key={p.slug}
            producto={p}
            sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
          />
        ))}
      </div>
      <p className={`${s.aviso} label`}>
        Tus favoritos se guardan en este dispositivo. No los verás desde otro
        teléfono o computador.
      </p>
    </>
  );
}
