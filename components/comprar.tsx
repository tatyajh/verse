"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatCOP } from "@/lib/money";
import type { Product, Talla } from "@/lib/products";
import s from "./comprar.module.css";

export default function Comprar({ producto }: { producto: Product }) {
  const { agregar } = useCart();
  const unica = producto.tallas.length === 1;
  const [talla, setTalla] = useState<Talla | null>(unica ? producto.tallas[0] : null);
  const [aviso, setAviso] = useState("");

  const alAgregar = () => {
    if (!talla) {
      setAviso("Primero elige tu talla.");
      return;
    }
    agregar(producto.slug, talla);
    setAviso("Listo, está en tu carrito.");
  };

  return (
    <div className={s.bloque}>
      <div className={`${s.cabecera} label num`}>
        <span>{formatCOP(producto.precio)}</span>
        <span>{unica
            ? "Talla única"
            : `${producto.tallas[0]} – ${producto.tallas[producto.tallas.length - 1]}`}</span>
      </div>

      {!unica && (
        <div className={`${s.tallas} label`} role="group" aria-label="Talla">
          {producto.tallas.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTalla(t);
                setAviso("");
              }}
              aria-pressed={talla === t}
              className={`${s.talla} ${talla === t ? s.elegida : ""}`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <div className={s.accion}>
        <button type="button" className="btn btn-fg" onClick={alAgregar}>
          Añadir al carrito
        </button>
        <Link href="/carrito" className="label link">
          Ver carrito
        </Link>
      </div>

      <p className={`${s.aviso} label`} role="status">
        {aviso}
      </p>

      <p className={`${s.guia} label`}>
        <Link href="/blog/como-elegir-tu-talla" className="link">
          ¿Qué talla pido?
        </Link>{" "}
        Cambio de talla sin costo en el primer pedido
      </p>
    </div>
  );
}
