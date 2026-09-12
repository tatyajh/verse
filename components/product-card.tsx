import Link from "next/link";
import ProductImage from "./product-image";
import { formatCOP } from "@/lib/money";
import { getLinea, type Product } from "@/lib/products";
import s from "./product-card.module.css";

export default function ProductCard({
  producto,
  sizes,
  priority,
  className,
}: {
  producto: Product;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const linea = getLinea(producto.linea);

  return (
    <Link
      href={`/producto/${producto.slug}`}
      className={`${s.card} ${className ?? ""}`}
      aria-label={`${producto.nombre} — ${linea.nombre} — ${formatCOP(producto.precio)}`}
    >
      <div className={s.marco}>
        <ProductImage producto={producto} sizes={sizes} priority={priority} />
        <span className={`${s.linea} label`}>{linea.nombre}</span>
      </div>
      <div className={s.pie}>
        <h3 className={s.nombre}>{producto.nombre}</h3>
        <p className={s.resumen}>{producto.resumen}</p>
        <p className={`${s.precio} label num`}>{formatCOP(producto.precio)}</p>
      </div>
    </Link>
  );
}
