import Link from "next/link";
import ProductImage from "@/components/product-image";
import { formatCOP } from "@/lib/money";
import { getTonalidad, TIPO_LABEL, type Product } from "@/lib/products";
import s from "./tarjetas-sin-arco.module.css";

const precio = (p: Product) => (p.precio !== undefined ? formatCOP(p.precio) : null);
const detalle = (p: Product) => `${TIPO_LABEL[p.tipo]} de ${getTonalidad(p.tonalidad).nombre}`;

/** A. Etiqueta: la foto limpia y una etiqueta de prenda colgando de un hilo. */
export function TarjetaEtiqueta({ producto: p }: { producto: Product }) {
  return (
    <Link href={`/producto/${p.slug}`} className={s.etiqueta}>
      <div className={s.foto}>
        <ProductImage producto={p} sizes="(max-width: 760px) 90vw, 30vw" />
      </div>
      <span className={s.colgante}>
        <span className={s.hiloEtiqueta} aria-hidden="true" />
        <span className={s.tag}>
          <span className={s.ojal} aria-hidden="true" />
          <span className={s.tagNombre}>{p.nombre}</span>
          <span className={s.tagDetalle}>{detalle(p)}</span>
          {precio(p) && <span className={s.tagDetalle}>{precio(p)}</span>}
        </span>
      </span>
    </Link>
  );
}

/** B. Editorial: foto sin marco y el nombre grande cruzando su borde. */
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

/** C. Molde: marcas de corte en las esquinas, como en el patronaje. */
export function TarjetaMolde({ producto: p }: { producto: Product }) {
  return (
    <Link href={`/producto/${p.slug}`} className={s.molde}>
      <div className={s.moldeMarco}>
        <div className={s.foto}>
          <ProductImage producto={p} sizes="(max-width: 760px) 90vw, 30vw" />
        </div>
        {["si", "sd", "ii", "id"].map((e) => (
          <span key={e} className={`${s.marca} ${s[e]}`} aria-hidden="true" />
        ))}
      </div>
      <span className={s.moldeNombre}>{p.nombre}</span>
      <span className={s.moldeDetalle}>
        {detalle(p)}
        {precio(p) && `, ${precio(p)}`}
      </span>
    </Link>
  );
}
