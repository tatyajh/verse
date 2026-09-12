import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Panel from "@/components/panel";
import ProductCard from "@/components/product-card";
import VisorPieza from "@/components/visor-pieza";
import {
  esAurora,
  getLinea,
  getProduct,
  getTonalidad,
  PRODUCTS,
  type Product,
} from "@/lib/products";
import s from "./producto.module.css";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/producto/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const producto = getProduct(slug);
  if (!producto) return { title: "Pieza no encontrada" };
  return {
    title: producto.nombre,
    description: producto.resumen ?? `${producto.nombre} — Versé Intimates.`,
    openGraph: {
      title: `${producto.nombre} — Versé`,
      description: producto.resumen ?? `${producto.nombre} — Versé Intimates.`,
    },
  };
}

/** Ruta y "también de la casa" dependen de si la pieza es de Aurora o de una línea. */
function contexto(producto: Product) {
  if (esAurora(producto)) {
    const tonalidad = getTonalidad(producto.tonalidad);
    const hermanas = PRODUCTS.filter(
      (p): p is typeof producto =>
        esAurora(p) && p.tonalidad === producto.tonalidad && p.slug !== producto.slug,
    ).concat(
      PRODUCTS.filter(
        (p): p is typeof producto => esAurora(p) && p.tonalidad !== producto.tonalidad,
      ),
    );
    return {
      migas: [
        { href: "/aurora", texto: "Aurora" },
        { href: `/aurora?tonalidad=${tonalidad.id}`, texto: tonalidad.nombre },
      ],
      hermanas,
      verTodo: "/aurora",
    };
  }

  const linea = getLinea(producto.linea);
  const hermanas = PRODUCTS.filter(
    (p) => !esAurora(p) && p.linea === producto.linea && p.slug !== producto.slug,
  ).concat(PRODUCTS.filter((p) => !esAurora(p) && p.linea !== producto.linea));
  return {
    migas: [
      { href: "/coleccion", texto: "Colección" },
      { href: `/coleccion?linea=${linea.id}`, texto: linea.nombre },
    ],
    hermanas,
    verTodo: "/coleccion",
  };
}

export default async function Pieza(props: PageProps<"/producto/[slug]">) {
  const { slug } = await props.params;
  const producto = getProduct(slug);
  if (!producto) notFound();

  const { migas, hermanas, verTodo } = contexto(producto);
  const aurora = esAurora(producto);
  const sinConfirmar = !producto.resumen && !producto.descripcion;

  return (
    <Panel tono="noche" seam={false}>
      <div className="wrap">
        <article className={s.pieza}>
          <VisorPieza producto={producto} sizes="(max-width: 860px) 100vw, 55vw" />

          <div className={s.ficha}>
            <nav className={`${s.migas} label`} aria-label="Ruta">
              {migas.map((m, i) => (
                <span key={m.href} className={s.miga}>
                  {i > 0 && <span aria-hidden="true">/</span>}
                  <Link href={m.href} className="link">
                    {m.texto}
                  </Link>
                </span>
              ))}
            </nav>

            <h1 className={s.nombre}>{producto.nombre}</h1>

            {sinConfirmar ? (
              <p className={s.resumen}>
                Pieza de la colección Aurora. El diseño final, el precio y la fecha de
                lanzamiento todavía se están definiendo.
              </p>
            ) : (
              <>
                {producto.resumen && <p className={s.resumen}>{producto.resumen}</p>}
                {producto.descripcion && (
                  <p className={s.descripcion}>{producto.descripcion}</p>
                )}
              </>
            )}

            {aurora && producto.tipo === "conjunto" && producto.piezas && (
              <p className={`${s.incluye} label`}>Conjunto de {producto.piezas} piezas</p>
            )}

            {(producto.cuidado || !aurora) && (
              <>
                <div className={s.separador} />

                {/* La composición del tejido (producto.materiales) es ficha técnica
                    de producción, no contenido de venta: no se muestra aquí. */}
                <div className={s.datos}>
                  {producto.cuidado && (
                    <div className={s.dato}>
                      <h2 className="label">Cuidado</h2>
                      <p>{producto.cuidado}</p>
                    </div>
                  )}
                  <div className={s.dato}>
                    <h2 className="label">Envíos</h2>
                    <p>
                      A toda Colombia, de 2 a 5 días hábiles. Cada pedido llega en el
                      empaque Versé, con papel seda y sello de la llave.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </article>

        <section className={s.tambien}>
          <div className={`${s.tambienCinta} label`}>
            <span>También de la casa</span>
            <Link href={verTodo} className="link">
              Ver todo
            </Link>
          </div>
          <div className={s.tambienRejilla}>
            {hermanas.slice(0, 3).map((p) => (
              <ProductCard
                key={p.slug}
                producto={p}
                sizes="(max-width: 560px) 100vw, 33vw"
              />
            ))}
          </div>
        </section>
      </div>
    </Panel>
  );
}
