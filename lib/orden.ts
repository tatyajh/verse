import { getProduct, type Talla } from "./products";

/**
 * Reglas comerciales del pedido.
 *
 * OJO: estas dos cifras son un supuesto de arranque, no una decisión de la
 * marca. Cámbialas cuando Versé cierre tarifa con la transportadora.
 */
export const ENVIO = {
  costo: 15000,
  gratisDesde: 250000,
};

export type ItemPedido = {
  slug: string;
  talla: Talla;
  cantidad: number;
};

export type Totales = {
  subtotal: number;
  envio: number;
  total: number;
  piezas: number;
};

/**
 * Calcula totales resolviendo cada precio desde el catálogo. Se usa igual en el
 * cliente (para mostrar) y en el servidor (para cobrar), así que lo que se ve
 * y lo que se cobra no pueden separarse.
 */
export function calcularTotales(items: ItemPedido[]): Totales {
  let subtotal = 0;
  let piezas = 0;

  for (const item of items) {
    const producto = getProduct(item.slug);
    if (!producto) continue;
    const cantidad = Math.min(Math.max(Math.floor(item.cantidad), 1), 9);
    subtotal += producto.precio * cantidad;
    piezas += cantidad;
  }

  const envio = subtotal === 0 || subtotal >= ENVIO.gratisDesde ? 0 : ENVIO.costo;
  return { subtotal, envio, total: subtotal + envio, piezas };
}

/** Referencia legible en el dashboard de Wompi y en el correo del pedido. */
export function nuevaReferencia(): string {
  const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const azar = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `VERSE-${fecha}-${azar}`;
}

/** Resumen de una línea para el correo de pedido. */
export function describirItems(items: ItemPedido[]): string {
  return items
    .map((i) => {
      const p = getProduct(i.slug);
      return p ? `${p.nombre} · talla ${i.talla} · ×${i.cantidad}` : null;
    })
    .filter(Boolean)
    .join("\n");
}
