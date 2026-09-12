/**
 * El símbolo de Versé: una V cuyo brazo derecho no termina — sube y se
 * convierte en el vástago de una llave, con anillo y dos dientes.
 *
 * Trazo abierto y fino a propósito: a tamaño pequeño lee como monograma,
 * a tamaño grande como grabado.
 */
export default function Monogram({
  size = 24,
  stroke = 2.4,
  className,
}: {
  size?: number;
  stroke?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 96"
      width={size}
      height={(size * 96) / 64}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 34 L32 88 L56 34" />
      <path d="M56 34 L56 22.5" />
      <circle cx="56" cy="14" r="8" />
      <circle cx="56" cy="14" r="2.4" fill="currentColor" stroke="none" />
      <path d="M56 29 L63 29" />
      <path d="M56 33.5 L60.5 33.5" />
    </svg>
  );
}
