/**
 * El emblema real de la marca, recortado del arte que envió Versé
 * (verse-mark.svg: cápsula + V + llave; verse-bow.svg: solo el cierre
 * ornamental —corazón y flor de lis— para espacios pequeños donde el
 * emblema completo, muy vertical, no cabe bien).
 *
 * Color fijo de marca (#DEA193, relleno y trazo): no se tiñe con los
 * tokens del panel, igual que un herraje no cambia de color según la
 * pared donde cuelga. Al servirse como <img>, el color vive dentro del
 * SVG y no puede cambiarse desde CSS.
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
}: {
  size?: Tamano;
  className?: string;
}) {
  return <Marca src="/verse-mark.svg" size={size} className={className} />;
}

/** Solo el cierre —corazón y flor de lis—. Para espacios pequeños o casi cuadrados. */
export function VerseBow({
  size = 24,
  className,
}: {
  size?: Tamano;
  className?: string;
}) {
  return <Marca src="/verse-bow.svg" size={size} className={className} />;
}
