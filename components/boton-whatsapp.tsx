import { enlaceWhatsApp } from "@/lib/contacto";
import s from "./boton-whatsapp.module.css";

const Icono = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={s.icono}>
    <path
      fill="currentColor"
      d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.25 8.24a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.26-8.24m-3.2 4.2c-.15 0-.4.06-.61.28-.21.22-.8.79-.8 1.92s.82 2.23.94 2.38c.11.16 1.59 2.43 3.86 3.4.54.24.96.37 1.29.48.54.17 1.03.15 1.42.09.44-.06 1.34-.55 1.53-1.08s.19-.98.13-1.08c-.06-.1-.21-.16-.44-.28-.23-.11-1.34-.66-1.55-.74-.21-.08-.36-.11-.51.12-.15.22-.58.73-.71.88-.13.15-.26.17-.49.06-.23-.12-.96-.36-1.83-1.13-.68-.6-1.13-1.35-1.27-1.57-.13-.23-.01-.35.1-.46.1-.1.23-.27.34-.4.11-.14.15-.23.23-.39.08-.15.04-.29-.02-.4-.06-.12-.5-1.24-.71-1.69-.18-.44-.37-.38-.51-.39z"
    />
  </svg>
);

/**
 * Escribir por WhatsApp es como compra la mayoría de las clientas en Colombia:
 * el mensaje llega ya redactado con la pieza que estaban mirando.
 *
 * Sin número en lib/contacto.ts no se muestra: un botón que no lleva a ningún
 * lado es peor que no tenerlo. Nunca un número de relleno.
 */
export default function BotonWhatsApp({
  mensaje,
  texto = "Escríbenos por WhatsApp",
  className,
}: {
  mensaje: string;
  texto?: string;
  className?: string;
}) {
  const enlace = enlaceWhatsApp(mensaje);

  if (!enlace) return null;

  return (
    <a
      href={enlace}
      target="_blank"
      rel="noopener noreferrer"
      className={`${s.boton} label ${className ?? ""}`}
    >
      <Icono />
      <span>{texto}</span>
    </a>
  );
}
