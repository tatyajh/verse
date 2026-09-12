import type { Metadata } from "next";
import Link from "next/link";
import Panel from "@/components/panel";
import ProductCard from "@/components/product-card";
import { esAurora, LINEAS, PRODUCTS, type Linea } from "@/lib/products";
import s from "./coleccion.module.css";

export const metadata: Metadata = {
  title: "Colección",
  description:
    "Seis piezas en tres líneas, de lo cotidiano a lo especial. Tallas XS a XL, envíos a toda Colombia.",
};

function esLinea(valor: string | undefined): valor is Linea {
  return LINEAS.some((l) => l.id === valor);
}

export default async function Coleccion(props: PageProps<"/coleccion">) {
  const query = await props.searchParams;
  const crudo = Array.isArray(query.linea) ? query.linea[0] : query.linea;
  const activa = esLinea(crudo) ? crudo : null;

  // Aurora es una colección aparte (ver /aurora), no entra en este catálogo.
  const catalogo = PRODUCTS.filter((p) => !esAurora(p));
  const piezas = activa ? catalogo.filter((p) => !esAurora(p) && p.linea === activa) : catalogo;
  const info = activa ? LINEAS.find((l) => l.id === activa)! : null;

  return (
    <Panel tono="seda" seam={false}>
      <div className="wrap">
        <header className={s.cabecera}>
          <p className="label muted">{activa ? "Línea" : "Todas las piezas"}</p>
          <h1 className={s.titulo}>{info ? info.nombre : "Colección"}</h1>
          <p className={s.intro}>
            {info
              ? info.descripcion
              : "Seis piezas en tres líneas. Tallas XS a XL, envíos a toda Colombia, y cada pedido en el empaque Versé."}
          </p>
        </header>

        <nav className={`${s.filtro} label`} aria-label="Filtrar por línea">
          <Link href="/coleccion" className={activa ? "" : s.activo}>
            Todas
          </Link>
          {LINEAS.map((l) => (
            <Link
              key={l.id}
              href={`/coleccion?linea=${l.id}`}
              className={activa === l.id ? s.activo : ""}
            >
              {l.nombre}
            </Link>
          ))}
        </nav>

        {piezas.length === 0 ? (
          <p className={s.vacio}>Esta línea todavía no tiene piezas publicadas.</p>
        ) : (
          <div className={s.rejilla}>
            {piezas.map((producto, i) => (
              <ProductCard
                key={producto.slug}
                producto={producto}
                priority={i < 2}
                sizes="(max-width: 620px) 100vw, 50vw"
              />
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}
