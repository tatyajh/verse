import Image from "next/image";
import LaceCanvas from "./lace-canvas";
import type { Product } from "@/lib/products";

/**
 * Una sola puerta para la imagen de producto: si la pieza ya tiene fotografía
 * se usa; si no, se dibuja su grabado. Añadir fotos después es agregar `image`
 * en products.ts — ningún componente cambia.
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
  return <LaceCanvas slug={producto.slug} className={className} />;
}
