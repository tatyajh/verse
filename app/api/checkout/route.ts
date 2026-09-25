import { avisar } from "@/lib/aviso";
import { toCents } from "@/lib/money";
import {
  calcularTotales,
  describirItems,
  nuevaReferencia,
  type ItemPedido,
} from "@/lib/orden";
import { getProduct, type Talla } from "@/lib/products";
import { firmaIntegridad, llavePublica, MONEDA, URL_CHECKOUT } from "@/lib/wompi";

export const runtime = "nodejs";

function limpiarItems(crudo: unknown): ItemPedido[] {
  if (!Array.isArray(crudo)) return [];
  return crudo.flatMap((item): ItemPedido[] => {
    if (typeof item !== "object" || item === null) return [];
    const { slug, talla, cantidad } = item as Record<string, unknown>;
    if (typeof slug !== "string" || typeof talla !== "string") return [];
    const producto = getProduct(slug);
    if (!producto) return [];
    if (!producto.tallas.includes(talla as Talla)) return [];
    const n = Number(cantidad);
    if (!Number.isFinite(n) || n < 1) return [];
    return [{ slug, talla: talla as Talla, cantidad: Math.min(Math.floor(n), 9) }];
  });
}

export async function POST(request: Request) {
  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return Response.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const items = limpiarItems((cuerpo as { items?: unknown })?.items);
  if (items.length === 0) {
    return Response.json(
      { error: "No hay piezas válidas en el carrito." },
      { status: 400 },
    );
  }

  // Una pieza sin precio real (o en 0, como los provisionales) nunca se cobra:
  // si pasara, el total sería solo el envío.
  const sinPrecio = items.find((i) => !getProduct(i.slug)?.precio);
  if (sinPrecio) {
    return Response.json(
      { error: "Esta pieza todavía no está a la venta. Te avisamos cuando salga." },
      { status: 400 },
    );
  }

  // El monto se recalcula aquí desde el catálogo. Lo que mande el navegador
  // sobre precios se ignora por completo.
  const totales = calcularTotales(items);
  if (totales.total <= 0) {
    return Response.json({ error: "El total del pedido es cero." }, { status: 400 });
  }

  if (!process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || !process.env.WOMPI_INTEGRITY_SECRET) {
    return Response.json(
      {
        error:
          "Los pagos todavía no están configurados. Falta cargar las llaves de Wompi.",
      },
      { status: 503 },
    );
  }

  const publica = llavePublica();
  const referencia = nuevaReferencia();
  const centavos = toCents(totales.total);
  const firma = firmaIntegridad(referencia, centavos);

  const sitio = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

  await avisar(
    `Pedido iniciado · ${referencia}`,
    [
      `Referencia: ${referencia}`,
      `Total: ${totales.total} COP (envío ${totales.envio})`,
      "",
      describirItems(items),
      "",
      "Este correo se envía al abrir el checkout. La confirmación de pago llega aparte.",
    ].join("\n"),
  );

  return Response.json({
    urlCheckout: URL_CHECKOUT,
    llavePublica: publica,
    moneda: MONEDA,
    referencia,
    centavos,
    firma,
    redirectUrl: `${sitio}/pedido`,
    totales,
  });
}
