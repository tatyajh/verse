import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Panel from "@/components/panel";
import { TarjetaEditorial } from "@/components/firmas/tarjetas-sin-arco";
import VisorPieza from "@/components/visor-pieza";
import BotonFavorito from "@/components/boton-favorito";
import BotonWhatsApp from "@/components/boton-whatsapp";
import { getProduct, getTonalidad, PRODUCTS } from "@/lib/products";
import { getColeccion } from "@/lib/colecciones";
import { galeriaDe } from "@/lib/catalogo";
import { WHATSAPP } from "@/lib/contacto";
import s from "./producto.module.css";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/producto/[slug]">,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // Al definir openGraph aquí se reemplaza el de la raíz entero; la imagen
  // para compartir se hereda a mano.
  const imagenes = (await parent).openGraph?.images ?? [];
  const { slug } = await props.params;
  const producto = getProduct(slug);
  if (!producto) return { title: "Producto no encontrado" };
  return {
    title: producto.nombre,
    description: producto.resumen ??
      `${producto.nombre}, de la colección ${getColeccion(producto.coleccion).nombre} de Versé Intimates.`,
    openGraph: {
      images: imagenes,
      title: `${producto.nombre} — Versé`,
      description:
        producto.resumen ??
        `${producto.nombre}, de la colección ${getColeccion(producto.coleccion).nombre} de Versé Intimates.`,
    },
  };
}

export default async function Pieza(props: PageProps<"/producto/[slug]">) {
  const { slug } = await props.params;
  const producto = getProduct(slug);
  if (!producto) notFound();

  const tonalidad = getTonalidad(producto.tonalidad);
  const coleccion = getColeccion(producto.coleccion);
  // Primero las del mismo momento, después el resto de la colección.
  const deLaColeccion = PRODUCTS.filter(
    (p) => p.coleccion === producto.coleccion && p.slug !== producto.slug && !p.componenteDe,
  );
  const hermanas = [
    ...deLaColeccion.filter((p) => p.tonalidad === producto.tonalidad),
    ...deLaColeccion.filter((p) => p.tonalidad !== producto.tonalidad),
  ];

  const sinConfirmar = !producto.resumen && !producto.descripcion;

  return (
    <Panel tono="noche" seam={false}>
      <div className="wrap">
        <article className={s.pieza}>
          <VisorPieza
            producto={producto}
            galeria={galeriaDe(producto)}
            sizes="(max-width: 860px) 100vw, 55vw"
          />

          <div className={s.ficha}>
            <nav className={`${s.migas} label`} aria-label="Ruta">
              <span className={s.miga}>
                <Link href={coleccion.productos} className="link">
                  {coleccion.nombre}
                </Link>
              </span>
              <span className={s.miga}>
                <span aria-hidden="true">/</span>
                <Link href={`${coleccion.productos}&momento=${tonalidad.id}`} className="link">
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
                Producto de la colección {coleccion.nombre}. La descripción completa se
                publica con el lanzamiento.
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
              <p className={`${s.incluye} label`}>Conjunto de {producto.piezas} prendas</p>
            )}

            <div className={s.separador} />

            {/* Comprar y el aviso de "próximamente" los pinta <VisorPieza/>,
                pegados a la imagen: aquí duplicarían el mismo llamado. */}
            {WHATSAPP && (
              <>
                <BotonWhatsApp
                  mensaje={`Hola Versé, me interesa ${producto.nombre} de ${coleccion.nombre} ${tonalidad.nombre}.`}
                />
                <div className={s.separador} />
              </>
            )}

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
                <Link href="/legal/envios-y-cambios" className={`${s.masInfo} label link`}>
                  Envíos y cambios
                </Link>
              </div>
            </div>
          </div>
        </article>

        <section className={s.tambien}>
          <div className={`${s.tambienCinta} label`}>
            <span>También de {coleccion.nombre}</span>
            <Link href={coleccion.productos} className="link">
              Ver todo
            </Link>
          </div>
          <div className={s.tambienRejilla}>
            {hermanas.slice(0, 3).map((p) => (
              <TarjetaEditorial key={p.slug} producto={p} />
            ))}
          </div>
        </section>
      </div>
    </Panel>
  );
}
