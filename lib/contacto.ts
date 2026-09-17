/**
 * Datos de contacto de la casa.
 *
 * WHATSAPP va en formato internacional sin signos ni espacios: para Colombia,
 * 57 seguido del número (por ejemplo "573001234567"). Mientras esté vacío los
 * botones de WhatsApp no se pintan, para no dejar enlaces rotos en producción.
 */
export const WHATSAPP = "";

export const CORREO = "hola@verseintimates.com";

export function enlaceWhatsApp(mensaje: string): string | null {
  if (!WHATSAPP) return null;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
}
