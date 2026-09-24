"use client";

import Link from "next/link";
import { useState } from "react";
import ProductImage from "./product-image";
import { useCart } from "@/lib/cart";
import { formatCOP } from "@/lib/money";
import { calcularTotales, ENVIO } from "@/lib/orden";
import s from "@/app/carrito/carrito.module.css";

type Checkout = {
  urlCheckout: string;
  llavePublica: string;
  moneda: string;
  referencia: string;
  centavos: number;
  firma: string;
  redirectUrl: string;
};

/**
 * Envía a Wompi con un formulario GET real, que es la forma documentada del
 * Checkout Web. Armar la URL a mano es frágil: uno de los parámetros lleva
 * dos puntos (`signature:integrity`) y se rompe con facilidad al codificar.
 */
function irAWompi(datos: Checkout) {
  const campos: Record<string, string> = {
    "public-key": datos.llavePublica,
    currency: datos.moneda,
    "amount-in-cents": String(datos.centavos),
    reference: datos.referencia,
    "signature:integrity": datos.firma,
    "redirect-url": datos.redirectUrl,
  };

  const form = document.createElement("form");
  form.method = "GET";
  form.action = datos.urlCheckout;
  for (const [nombre, valor] of Object.entries(campos)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = nombre;
    input.value = valor;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}

export default function CarritoCliente() {
  const { lineas, listo, cambiarCantidad, quitar } = useCart();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const totales = calcularTotales(
    lineas.map((l) => ({ slug: l.slug, talla: l.talla, cantidad: l.cantidad })),
  );

  const pagar = async () => {
    setEnviando(true);
    setError("");
    try {
      const respuesta = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lineas.map((l) => ({
            slug: l.slug,
            talla: l.talla,
            cantidad: l.cantidad,
          })),
        }),
      });

      const datos = await respuesta.json();
      if (!respuesta.ok) {
        setError(datos?.error ?? "No pudimos abrir el pago. Intenta de nuevo.");
        setEnviando(false);
        return;
      }
      irAWompi(datos as Checkout);
    } catch {
      setError("No pudimos conectar con la pasarela. Revisa tu conexión.");
      setEnviando(false);
    }
  };

  // Mientras se lee localStorage no se muestra "vacío": evita el parpadeo.
  if (!listo) {
    return (
      <div className={s.vacio}>
        <p className="label muted">Abriendo el carrito…</p>
      </div>
    );
  }

  if (lineas.length === 0) {
    return (
      <div className={s.vacio}>
        <p>Aún no has elegido nada.</p>
        <Link href="/aurora?view=productos" className="btn btn-fg">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className={s.cuerpo}>
      <div className={s.lineas}>
        {lineas.map((l) => (
          <div key={`${l.slug}-${l.talla}`} className={s.linea}>
            <Link href={`/producto/${l.slug}`} className={s.miniatura}>
              <ProductImage producto={l.producto} sizes="88px" />
            </Link>

            <div className={s.datos}>
              <Link href={`/producto/${l.slug}`} className={s.nombre}>
                {l.producto.nombre}
              </Link>
              <p className={`${s.meta} label`}>
                Talla {l.talla} · {formatCOP(l.producto.precio)}
              </p>
              <button
                type="button"
                className={`${s.quitar} label link`}
                onClick={() => quitar(l.slug, l.talla)}
              >
                Quitar
              </button>
            </div>

            <div className={`${s.cantidad} label num`}>
              <button
                type="button"
                onClick={() => cambiarCantidad(l.slug, l.talla, l.cantidad - 1)}
                aria-label={`Quitar una unidad de ${l.producto.nombre}`}
              >
                −
              </button>
              <span>{l.cantidad}</span>
              <button
                type="button"
                disabled={l.cantidad >= 9}
                onClick={() => cambiarCantidad(l.slug, l.talla, l.cantidad + 1)}
                aria-label={`Añadir una unidad de ${l.producto.nombre}`}
              >
                +
              </button>
            </div>

            <p className={`${s.subtotal} label num`}>{formatCOP(l.subtotal)}</p>
          </div>
        ))}
      </div>

      <aside className={s.resumen}>
        <p className={`${s.fila} label num`}>
          <span>Subtotal</span>
          <span>{formatCOP(totales.subtotal)}</span>
        </p>
        <p className={`${s.fila} label num`}>
          <span>Envío</span>
          <span>{totales.envio === 0 ? "Sin costo" : formatCOP(totales.envio)}</span>
        </p>
        <p className={`${s.filaTotal} label num`}>
          <span>Total</span>
          <strong>{formatCOP(totales.total)}</strong>
        </p>

        <button
          type="button"
          className="btn btn-fg"
          onClick={pagar}
          disabled={enviando}
        >
          {enviando ? "Abriendo pago…" : "Pagar"}
        </button>

        {error && (
          <p className={`${s.error} label`} role="alert">
            {error}
          </p>
        )}

        <p className={`${s.medios} label`}>
          Tarjeta, PSE, Nequi y Bancolombia · Envío sin costo desde{" "}
          {formatCOP(ENVIO.gratisDesde)}
        </p>
      </aside>
    </div>
  );
}
