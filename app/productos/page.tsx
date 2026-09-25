import type { Metadata } from "next";
import Link from "next/link";
import Panel from "@/components/panel";
import GrupoPiezas from "@/components/grupo-piezas";
import FiltroTipo from "@/components/filtro-tipo";
import { agruparPorTipo, esTipoPieza } from "@/lib/catalogo";
import { COLECCIONES, type ColeccionId } from "@/lib/colecciones";
import { PRODUCTS } from "@/lib/products";
import s from "./productos.module.css";

export const metadata: Metadata = {
  title: "Todos los productos",
  description: "Todos los productos de Versé Intimates, de todas sus colecciones.",
};

function esColeccion(valor: string | undefined): valor is ColeccionId {
  return COLECCIONES.some((c) => c.id === valor);
}

/** Todo el catálogo de Versé, sin importar la colección. */
export default async function Productos(props: PageProps<"/productos">) {
  const query = await props.searchParams;
  const uno = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const crudoTipo = uno(query.tipo);
  const tipo = esTipoPieza(crudoTipo) ? crudoTipo : null;
  const crudaColeccion = uno(query.coleccion);
  const coleccion = esColeccion(crudaColeccion) ? crudaColeccion : null;

  const fuente = coleccion ? PRODUCTS.filter((p) => p.coleccion === coleccion) : PRODUCTS;
  const grupos = agruparPorTipo(fuente, tipo);
  const base = coleccion ? `/productos?coleccion=${coleccion}` : "/productos";

  return (
    <Panel tono="noche" seam={false}>
      <div className="wrap">
        <header className={s.cabecera}>
          <h1 className={s.titulo}>Todos los productos</h1>
          <p className={s.intro}>
            El catálogo completo de Versé. Cada producto dice a qué colección pertenece.
          </p>
        </header>

        {/* Con una sola colección no hay nada que elegir; aparece cuando haya más. */}
        {COLECCIONES.length > 1 && (
          <nav className={`${s.colecciones} label`} aria-label="Colección">
            <Link href="/productos" className={!coleccion ? s.activa : ""} scroll={false}>
              Todas
            </Link>
            {COLECCIONES.map((c) => (
              <Link
                key={c.id}
                href={`/productos?coleccion=${c.id}`}
                className={coleccion === c.id ? s.activa : ""}
                scroll={false}
              >
                {c.nombre}
              </Link>
            ))}
          </nav>
        )}

        <FiltroTipo base={base} activo={tipo} />

        {grupos.map(({ tipo: t, productos }) => (
          <GrupoPiezas key={t} tipo={t} productos={productos} />
        ))}
      </div>
    </Panel>
  );
}
