import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Integración con Wompi (Bancolombia).
 *
 * Este módulo solo se importa desde el servidor. Los secretos de integridad y
 * de eventos nunca deben cruzar al navegador: si aparecen en un componente
 * cliente, cualquiera puede firmar un pago por el monto que quiera.
 */

export const MONEDA = "COP" as const;

export function llavePublica(): string {
  const llave = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
  if (!llave) throw new Error("Falta NEXT_PUBLIC_WOMPI_PUBLIC_KEY");
  return llave;
}

/** Sandbox y producción se distinguen por el prefijo de la llave pública. */
export function baseApi(): string {
  const llave = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY ?? "";
  return llave.startsWith("pub_prod_")
    ? "https://production.wompi.co/v1"
    : "https://sandbox.wompi.co/v1";
}

export const URL_CHECKOUT = "https://checkout.wompi.co/p/";

function sha256(texto: string): string {
  return createHash("sha256").update(texto, "utf8").digest("hex");
}

/**
 * Firma de integridad: SHA256(referencia + monto + moneda + secreto).
 * El orden de concatenación no es negociable; si se altera, Wompi rechaza.
 */
export function firmaIntegridad(referencia: string, centavos: number): string {
  const secreto = process.env.WOMPI_INTEGRITY_SECRET;
  if (!secreto) throw new Error("Falta WOMPI_INTEGRITY_SECRET");
  return sha256(`${referencia}${centavos}${MONEDA}${secreto}`);
}

export type TransaccionWompi = {
  id: string;
  status: "APPROVED" | "DECLINED" | "VOIDED" | "ERROR" | "PENDING";
  reference: string;
  amount_in_cents: number;
  currency: string;
  payment_method_type?: string;
  customer_email?: string;
  finalized_at?: string | null;
};

export type EventoWompi = {
  event: string;
  data: { transaction?: TransaccionWompi };
  signature: { properties: string[]; checksum: string };
  timestamp: number;
  environment?: string;
};

function leerRuta(objeto: unknown, ruta: string): string {
  const valor = ruta.split(".").reduce<unknown>((acc, clave) => {
    if (acc && typeof acc === "object" && clave in acc) {
      return (acc as Record<string, unknown>)[clave];
    }
    return undefined;
  }, objeto);
  return valor === undefined || valor === null ? "" : String(valor);
}

/**
 * Valida el checksum de un evento: se concatenan los valores de las
 * propiedades que el propio evento declara, en ese orden, más el timestamp y
 * el secreto de eventos. Sin esto, cualquiera podría hacer POST al webhook
 * diciendo que un pedido quedó aprobado.
 */
export function eventoEsAutentico(evento: EventoWompi): boolean {
  const secreto = process.env.WOMPI_EVENTS_SECRET;
  if (!secreto) throw new Error("Falta WOMPI_EVENTS_SECRET");
  if (!evento?.signature?.checksum || !Array.isArray(evento.signature.properties)) {
    return false;
  }

  const concatenado =
    evento.signature.properties.map((p) => leerRuta(evento.data, p)).join("") +
    String(evento.timestamp) +
    secreto;

  const esperado = Buffer.from(sha256(concatenado), "utf8");
  const recibido = Buffer.from(evento.signature.checksum.toLowerCase(), "utf8");
  if (esperado.length !== recibido.length) return false;
  return timingSafeEqual(esperado, recibido);
}

/**
 * Consulta una transacción desde el servidor. Wompi ya no permite consultarlas
 * desde el frontend, así que la página de retorno pasa por aquí.
 */
export async function consultarTransaccion(
  id: string,
): Promise<TransaccionWompi | null> {
  const privada = process.env.WOMPI_PRIVATE_KEY;
  if (!privada) throw new Error("Falta WOMPI_PRIVATE_KEY");

  const respuesta = await fetch(`${baseApi()}/transactions/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${privada}` },
    cache: "no-store",
  });

  if (!respuesta.ok) return null;
  const cuerpo = (await respuesta.json()) as { data?: TransaccionWompi };
  return cuerpo.data ?? null;
}
