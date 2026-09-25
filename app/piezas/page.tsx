import type { Metadata } from "next";
import Link from "next/link";
import Panel from "@/components/panel";
import GrupoPiezas from "@/components/grupo-piezas";
import FiltroTipo from "@/components/filtro-tipo";
import { agruparPorTipo, esTipoPieza } from "@/lib/catalogo";
import { COLECCIONES, type ColeccionId } from "@/lib/colecciones";
import { PRODUCTS } from "@/lib/products";
import s from "./piezas.module.css";

export const metadata: Metadata = {
  title: "Todas las piezas",
  description: "Todas las piezas de Versé Intimates, de todas sus colecciones.",
};

function esColeccion(valor: string | undefined): valor is ColeccionId {
  return COLECCIONES.some((c) => c.id === valor);
}

/** Todo el catálogo de Versé, sin importar la colección. */
export default async function Piezas(props: PageProps<"/piezas">) {
  const query = await props.searchParams;
  const uno = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const crudoTipo = uno(query.tipo);
  const tipo = esTipoPieza(crudoTipo) ? crudoTipo : null;
  const crudaColeccion = uno(query.coleccion);
  const coleccion = esColeccion(crudaColeccion) ? crudaColeccion : null;

  const fuente = coleccion ? PRODUCTS.filter((p) => p.coleccion === coleccion) : PRODUCTS;
  const grupos = agruparPorTipo(fuente, tipo);
  const base = coleccion ? `/piezas?coleccion=${coleccion}` : "/piezas";

  return (
    <Panel tono="noche" seam={false}>
      <div className="wrap">
        <header className={s.cabecera}>
          <h1 className={s.titulo}>Todas las piezas</h1>
          <p className={s.intro}>
            El catálogo completo de Versé. Cada pieza dice a qué colección pertenece.
          </p>
        </header>

        {/* Con una sola colección no hay nada que elegir; aparece cuando haya más. */}
        {COLECCIONES.length > 1 && (
          <nav className={`${s.colecciones} label`} aria-label="Colección">
            <Link href="/piezas" className={!coleccion ? s.activa : ""} scroll={false}>
              Todas
            </Link>
            {COLECCIONES.map((c) => (
              <Link
                key={c.id}
                href={`/piezas?coleccion=${c.id}`}
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
