import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Panel from "@/components/panel";
import ProductImage from "@/components/product-image";
import ProductCard from "@/components/product-card";
import Comprar from "@/components/comprar";
import ModosPieza from "@/components/modos-pieza";
import { getLinea, getProduct, PRODUCTS } from "@/lib/products";
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
    description: producto.resumen,
    openGraph: { title: `${producto.nombre} — Versé`, description: producto.resumen },
  };
}

export default async function Pieza(props: PageProps<"/producto/[slug]">) {
  const { slug } = await props.params;
  const producto = getProduct(slug);
  if (!producto) notFound();

  const linea = getLinea(producto.linea);
  const hermanas = PRODUCTS.filter(
    (p) => p.linea === producto.linea && p.slug !== producto.slug,
  ).concat(PRODUCTS.filter((p) => p.linea !== producto.linea).slice(0, 3));

  return (
    <Panel tono="noche" seam={false}>
      <div className="wrap">
        <article className={s.pieza}>
          <div className={s.marco}>
            <ProductImage
              producto={producto}
              priority
              sizes="(max-width: 860px) 100vw, 55vw"
            />
          </div>

          <div className={s.ficha}>
            <nav className={`${s.migas} label`} aria-label="Ruta">
              <Link href="/coleccion" className="link">
                Colección
              </Link>
              <span aria-hidden="true">/</span>
              <Link href={`/coleccion?linea=${linea.id}`} className="link">
                {linea.nombre}
              </Link>
            </nav>

            <h1 className={s.nombre}>{producto.nombre}</h1>
            <p className={s.resumen}>{producto.resumen}</p>
            <p className={s.descripcion}>{producto.descripcion}</p>

            <div className={s.separador} />

            <Comprar producto={producto} />

            <div className={s.separador} />

            <div className={s.datos}>
              <div className={s.dato}>
                <h2 className="label">Materiales</h2>
                <ul>
                  {producto.materiales.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
              <div className={s.dato}>
                <h2 className="label">Cuidado</h2>
                <p>{producto.cuidado}</p>
              </div>
              <div className={s.dato}>
                <h2 className="label">Envíos</h2>
                <p>
                  A toda Colombia, de 2 a 5 días hábiles. Cada pedido llega en el empaque
                  Versé, con papel seda y sello de la llave.
                </p>
              </div>
            </div>

            {producto.modos && <ModosPieza modos={producto.modos} />}
          </div>
        </article>

        <section className={s.tambien}>
          <div className={`${s.tambienCinta} label`}>
            <span>También de la casa</span>
            <Link href="/coleccion" className="link">
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
