import Link from "next/link";
import ProductImage from "./product-image";
import GaleriaTarjeta from "./galeria-tarjeta";
import BotonFavorito from "./boton-favorito";
import { formatCOP } from "@/lib/money";
import { TIPO_LABEL, getTonalidad, type Product } from "@/lib/products";
import { getColeccion } from "@/lib/colecciones";
import s from "./product-card.module.css";

export default function ProductCard({
  producto,
  sizes,
  priority,
  className,
  galeria,
}: {
  producto: Product;
  /** Conjunto y sus prendas: se muestran como miniaturas bajo la foto. */
  galeria?: Product[];
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const etiqueta = TIPO_LABEL[producto.tipo];
  const procedencia = `${getColeccion(producto.coleccion).nombre} ${getTonalidad(producto.tonalidad).nombre}`;
  const precio = producto.precio !== undefined ? formatCOP(producto.precio) : null;

  return (
    // El enlace se estira sobre la tarjeta en vez de envolverla: así el
    // corazón puede vivir encima sin quedar anidado dentro de un <a>.
    <div className={`${s.card} ${className ?? ""}`}>
      {galeria && galeria.length > 1 ? (
        <GaleriaTarjeta items={galeria} sizes={sizes} claseMarco={s.marco} />
      ) : (
        <div className={s.marco}>
          <ProductImage producto={producto} sizes={sizes} priority={priority} />
        </div>
      )}
      {/* La etiqueta de la prenda cuelga de un hilo sobre la foto y se mece al
          pasar el cursor. No recibe clics: el enlace de la tarjeta está debajo. */}
      <div className={s.colgante}>
        <span className={s.hilo} aria-hidden="true" />
        <div className={s.etiquetaPrenda}>
          <span className={s.ojal} aria-hidden="true" />
          <h3 className={s.nombre}>{producto.nombre}</h3>
          {precio && <p className={`${s.precio} num`}>{precio}</p>}
        </div>
      </div>
      <div className={s.pie}>
        <div className={s.pieFila}>
          <p className={`${s.procedencia} label`}>
            {etiqueta} de {procedencia}
          </p>
          <BotonFavorito
            slug={producto.slug}
            nombre={producto.nombre}
            className={s.favorito}
          />
        </div>
        {producto.resumen && <p className={s.resumen}>{producto.resumen}</p>}
      </div>
      <Link
        href={`/producto/${producto.slug}`}
        className={s.enlace}
        aria-label={[producto.nombre, `${etiqueta} de ${procedencia}`, precio].filter(Boolean).join(", ")}
      />
    </div>
  );
}
