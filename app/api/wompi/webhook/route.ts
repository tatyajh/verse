import { avisar } from "@/lib/aviso";
import { eventoEsAutentico, type EventoWompi } from "@/lib/wompi";

export const runtime = "nodejs";

/**
 * Webhook de Wompi (`transaction.updated`).
 *
 * Nada de lo que llegue aquí se cree sin validar el checksum: el endpoint es
 * público, así que sin esa verificación cualquiera podría anunciar pedidos
 * aprobados. Wompi reintenta hasta tres veces en 24 h si no recibe un 200.
 */
export async function POST(request: Request) {
  if (!process.env.WOMPI_EVENTS_SECRET) {
    console.error("[versé] webhook sin WOMPI_EVENTS_SECRET");
    return new Response("Webhook sin configurar", { status: 503 });
  }

  let evento: EventoWompi;
  try {
    evento = (await request.json()) as EventoWompi;
  } catch {
    return new Response("Cuerpo inválido", { status: 400 });
  }

  if (!eventoEsAutentico(evento)) {
    return new Response("Checksum inválido", { status: 401 });
  }

  if (evento.event !== "transaction.updated") {
    return new Response("ok", { status: 200 });
  }

  const t = evento.data?.transaction;
  if (!t) return new Response("ok", { status: 200 });

  const pesos = Math.round(t.amount_in_cents / 100);

  if (t.status === "APPROVED") {
    await avisar(
      `Pago aprobado · ${t.reference}`,
      [
        `Referencia: ${t.reference}`,
        `Transacción: ${t.id}`,
        `Total: ${pesos} ${t.currency}`,
        `Medio: ${t.payment_method_type ?? "—"}`,
        `Correo: ${t.customer_email ?? "—"}`,
        "",
        "Los productos y tallas están en el correo «Pedido iniciado» con la misma referencia.",
      ].join("\n"),
    );
  } else {
    await avisar(
      `Pago ${t.status} · ${t.reference}`,
      `Referencia: ${t.reference}\nTransacción: ${t.id}\nEstado: ${t.status}`,
    );
  }

  return new Response("ok", { status: 200 });
}
