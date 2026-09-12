"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart";

/** Se monta solo cuando el pago quedó aprobado: vacía el carrito una vez. */
export default function LimpiarCarrito() {
  const { vaciar, listo } = useCart();

  useEffect(() => {
    if (listo) vaciar();
  }, [listo, vaciar]);

  return null;
}
