import Image from "next/image";
import LaceCanvas, { PALETA_AURORA_DIURNA, PALETA_AURORA_NOCTURNA } from "./lace-canvas";
import type { Product } from "@/lib/products";

/**
 * Imagen de producto: la foto si la pieza tiene `image` en products.ts; si no,
 * el grabado de encaje con la paleta de su momento.
 */
export default function ProductImage({
  producto,
  className,
  sizes = "(max-width: 700px) 100vw, 33vw",
  priority = false,
}: {
  producto: Product;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (producto.image) {
    return (
      <Image
        src={producto.image}
        alt={producto.nombre}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
        style={{ objectFit: "cover" }}
      />
    );
  }

  const paleta = (producto.tonalidad === "borealis" || producto.tonalidad === "prima-luce") ? PALETA_AURORA_DIURNA : PALETA_AURORA_NOCTURNA;

  return <LaceCanvas slug={producto.slug} paleta={paleta} className={className} />;
}
