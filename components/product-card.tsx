import Link from "next/link";
import ProductImage from "./product-image";
import BotonFavorito from "./boton-favorito";
import { formatCOP } from "@/lib/money";
import { TIPO_LABEL, getTonalidad, type Product } from "@/lib/products";
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
  const etiqueta = TIPO_LABEL[producto.tipo];
  const procedencia = `Aurora · ${getTonalidad(producto.tonalidad).nombre}`;

  return (
    // El enlace se estira sobre la tarjeta en vez de envolverla: así el
    // corazón puede vivir encima sin quedar anidado dentro de un <a>.
    <div className={`${s.card} ${className ?? ""}`}>
      <div className={s.marco}>
        <ProductImage producto={producto} sizes={sizes} priority={priority} />
        <span className={`${s.linea} label`}>{etiqueta}</span>
      </div>
      <div className={s.pie}>
        <p className={`${s.procedencia} label`}>{procedencia}</p>
        <h3 className={s.nombre}>{producto.nombre}</h3>
        {producto.resumen && <p className={s.resumen}>{producto.resumen}</p>}
        <div className={s.pieFila}>
          <p className={`${s.precio} label num`}>{formatCOP(producto.precio)}</p>
          <BotonFavorito
            slug={producto.slug}
            nombre={producto.nombre}
            className={s.favorito}
          />
        </div>
      </div>
      <Link
        href={`/producto/${producto.slug}`}
        className={s.enlace}
        aria-label={`${producto.nombre} — ${etiqueta} de ${procedencia} — ${formatCOP(producto.precio)}`}
      />
    </div>
  );
}
