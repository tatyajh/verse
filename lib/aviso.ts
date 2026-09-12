/**
 * Aviso de pedido.
 *
 * v1 no guarda órdenes en base de datos: se avisa por correo al crear el
 * checkout (con las piezas y tallas) y otra vez cuando el webhook confirma el
 * pago, correlacionados por la referencia. Sin RESEND_API_KEY se registra en
 * consola, para que el desarrollo no dependa de una cuenta.
 */
export async function avisar(asunto: string, cuerpo: string): Promise<void> {
  const llave = process.env.RESEND_API_KEY;
  const destino = process.env.ORDER_NOTIFY_EMAIL;

  if (!llave || !destino) {
    console.info(`[versé] ${asunto}\n${cuerpo}`);
    return;
  }

  try {
    const respuesta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${llave}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.ORDER_FROM_EMAIL || "Versé <onboarding@resend.dev>",
        to: [destino],
        subject: asunto,
        text: cuerpo,
      }),
    });
    if (!respuesta.ok) {
      console.error(`[versé] correo rechazado (${respuesta.status})`);
    }
  } catch (error) {
    // Un fallo de correo nunca debe tumbar un pago en curso.
    console.error("[versé] no se pudo enviar el aviso", error);
  }
}
