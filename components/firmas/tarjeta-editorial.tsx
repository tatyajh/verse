import Link from "next/link";
import ProductImage from "@/components/product-image";
import { formatCOP } from "@/lib/money";
import { getTonalidad, TIPO_LABEL, type Product } from "@/lib/products";
import s from "./tarjeta-editorial.module.css";

const precio = (p: Product) => (p.precio !== undefined ? formatCOP(p.precio) : null);
const detalle = (p: Product) => `${TIPO_LABEL[p.tipo]} de ${getTonalidad(p.tonalidad).nombre}`;

/** Tarjeta editorial: la foto y el nombre grande cruzando su borde. */
export function TarjetaEditorial({ producto: p }: { producto: Product }) {
  return (
    <Link href={`/producto/${p.slug}`} className={s.editorial}>
      <div className={s.foto}>
        <ProductImage producto={p} sizes="(max-width: 760px) 90vw, 30vw" />
      </div>
      <span className={s.editorialNombre}>{p.nombre}</span>
      <span className={s.editorialDetalle}>
        {detalle(p)}
        {precio(p) && `, ${precio(p)}`}
      </span>
    </Link>
  );
}
