import ProductCard from "./product-card";
import { TIPO_PLURAL, type Product, type TipoPieza } from "@/lib/products";
import { galeriaDe } from "@/lib/catalogo";
import s from "./grupo-piezas.module.css";

const TAMANOS = "(max-width: 560px) 100vw, (max-width: 860px) 50vw, 33vw";

/**
 * Un tipo de prenda dentro del catálogo de una colección. Con
 * `conComponentes`, cada conjunto lleva sus prendas como galería en la
 * propia tarjeta.
 */
export default function GrupoPiezas({
  tipo,
  productos,
  descripcion,
  conComponentes = false,
}: {
  tipo: TipoPieza;
  productos: Product[];
  descripcion?: string;
  conComponentes?: boolean;
}) {
  return (
    <section className={s.grupo} aria-labelledby={`grupo-${tipo}`}>
      <div className={`${s.grupoCinta} label`}>
        <div>
          <h2 className={s.grupoTitulo} id={`grupo-${tipo}`}>
            {TIPO_PLURAL[tipo]}
          </h2>
          {descripcion && <p className={s.grupoDescripcion}>{descripcion}</p>}
        </div>
        <span>{productos.length}</span>
      </div>
      <div className={s.rejilla}>
        {productos.map((p) => (
          <ProductCard
            key={p.slug}
            producto={p}
            sizes={TAMANOS}
            galeria={conComponentes ? galeriaDe(p) : undefined}
          />
        ))}
      </div>
    </section>
  );
}
