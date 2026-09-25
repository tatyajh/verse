import { avisar } from "@/lib/aviso";
import { getProduct } from "@/lib/products";

export const runtime = "nodejs";

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Lista privada de la primera edición. Sin base de datos todavía: cada
 * inscripción llega por correo a la marca (o al log, sin RESEND_API_KEY).
 */
export async function POST(request: Request) {
  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = await request.json();
  } catch {
    return Response.json({ error: "No pudimos leer el formulario." }, { status: 400 });
  }

  // Campo trampa: una persona no lo ve, un bot lo llena. Se responde igual
  // que si hubiera salido bien para no darle pistas.
  if (typeof cuerpo.web === "string" && cuerpo.web.trim()) {
    return Response.json({ ok: true });
  }

  const correo = typeof cuerpo.correo === "string" ? cuerpo.correo.trim().toLowerCase() : "";
  if (!CORREO.test(correo) || correo.length > 200) {
    return Response.json({ error: "Revisa el correo: parece incompleto." }, { status: 400 });
  }

  const pieza = typeof cuerpo.pieza === "string" ? getProduct(cuerpo.pieza) : undefined;

  await avisar(
    pieza ? `Lista privada: ${pieza.nombre}` : "Lista privada: nueva inscripción",
    [
      `Correo: ${correo}`,
      pieza ? `Pieza: ${pieza.nombre} (${pieza.slug})` : "Pieza: primera edición en general",
      `Fecha: ${new Date().toISOString()}`,
    ].join("\n"),
  );

  return Response.json({ ok: true });
}
