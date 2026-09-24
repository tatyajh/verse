import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Panel from "@/components/panel";
import ProductCard from "@/components/product-card";
import VisorPieza from "@/components/visor-pieza";
import BotonFavorito from "@/components/boton-favorito";
import BotonWhatsApp from "@/components/boton-whatsapp";
import { getProduct, getTonalidad, PRODUCTS } from "@/lib/products";
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

export default async function Pieza(props: PageProps<"/producto/[slug]">) {
  const { slug } = await props.params;
  const producto = getProduct(slug);
  if (!producto) notFound();

  const tonalidad = getTonalidad(producto.tonalidad);
  const hermanas = PRODUCTS.filter(
    (p) => p.tonalidad === producto.tonalidad && p.slug !== producto.slug,
  ).concat(PRODUCTS.filter((p) => p.tonalidad !== producto.tonalidad));

  const sinConfirmar = !producto.resumen && !producto.descripcion;

  return (
    <Panel tono="noche" seam={false}>
      <div className="wrap">
        <article className={s.pieza}>
          <VisorPieza producto={producto} sizes="(max-width: 860px) 100vw, 55vw" />

          <div className={s.ficha}>
            <nav className={`${s.migas} label`} aria-label="Ruta">
              <span className={s.miga}>
                <Link href="/aurora?view=productos" className="link">
                  Tienda
                </Link>
              </span>
              <span className={s.miga}>
                <span aria-hidden="true">/</span>
                <Link href={`/aurora?view=productos&momento=${tonalidad.id}`} className="link">
                  {tonalidad.nombre}
                </Link>
              </span>
            </nav>

            <div className={s.tituloFila}>
              <h1 className={s.nombre}>{producto.nombre}</h1>
              <BotonFavorito slug={producto.slug} nombre={producto.nombre} />
            </div>

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

            {producto.tipo === "conjunto" && producto.piezas && (
              <p className={`${s.incluye} label`}>Conjunto de {producto.piezas} piezas</p>
            )}

            <div className={s.separador} />

            {/* Comprar y el aviso de "próximamente" los pinta <VisorPieza/>,
                pegados a la imagen: aquí duplicarían el mismo llamado. */}
            <BotonWhatsApp
              mensaje={`Hola Versé, me interesa ${producto.nombre} de Aurora ${tonalidad.nombre}.`}
            />

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
                  A toda Colombia, de 2 a 5 días hábiles. Cada pedido llega en el empaque
                  Versé, con papel seda y sello de la llave.
                </p>
              </div>
            </div>
          </div>
        </article>

        <section className={s.tambien}>
          <div className={`${s.tambienCinta} label`}>
            <span>También de Aurora</span>
            <Link href="/aurora?view=productos" className="link">
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
