import ProductCard from "./product-card";
import { getProduct, TIPO_PLURAL, type Product, type TipoPieza } from "@/lib/products";
import s from "./grupo-piezas.module.css";

const TAMANOS = "(max-width: 560px) 100vw, (max-width: 860px) 50vw, 33vw";

/**
 * Un tipo de prenda dentro del catálogo de una colección. Con
 * `conComponentes`, cada conjunto muestra debajo sus prendas sueltas.
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
        {productos.map((p) =>
          conComponentes && p.componentes?.length ? (
            <div key={p.slug} className={s.conjuntoBloque}>
              <ProductCard producto={p} sizes={TAMANOS} />
              <div className={s.componentesSection}>
                <p className={`${s.componentesLabel} label`}>O por separado</p>
                <div className={s.componentesGrid}>
                  {p.componentes
                    .map((slug) => getProduct(slug))
                    .filter((c) => c !== undefined)
                    .map((c) => (
                      <ProductCard
                        key={c.slug}
                        producto={c}
                        sizes="(max-width: 560px) 100vw, (max-width: 860px) 50vw, 25vw"
                      />
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <ProductCard key={p.slug} producto={p} sizes={TAMANOS} />
          ),
        )}
      </div>
    </section>
  );
}
