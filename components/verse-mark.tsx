/**
 * El emblema real de la marca, del arte que envió Versé (verse-mark.svg:
 * cápsula + V + llave). La llave es única: siempre se muestra completa,
 * nunca recortada ni redibujada.
 *
 * Dos acabados del mismo herraje: oro rosa (#DEA193) sobre noche y bronce
 * (#C4734A, verse-mark-hondo.svg) sobre seda, donde el rosa claro se
 * pierde. Al servirse como <img> el color vive dentro del SVG, así que el
 * cambio es de archivo, no de CSS.
 */
type Tamano = number | string;

function anchoCss(size: Tamano): string {
  return typeof size === "number" ? `${size}px` : size;
}

function Marca({
  src,
  size,
  className,
}: {
  src: string;
  size: Tamano;
  className?: string;
}) {
  return (
    // SVG de marca con color fijo: no necesita el pipeline de optimización de next/image.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden="true"
      style={{ width: anchoCss(size), height: "auto" }}
      className={className}
    />
  );
}

/** Cápsula + V + llave completas. Para usos grandes o con espacio vertical. */
export function VerseMark({
  size = 48,
  className,
  hondo = false,
}: {
  size?: Tamano;
  className?: string;
  /** Acabado bronce, para fondos claros. */
  hondo?: boolean;
}) {
  return (
    <Marca
      src={hondo ? "/verse-mark-hondo.svg" : "/verse-mark.svg"}
      size={size}
      className={className}
    />
  );
}
