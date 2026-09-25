import type { Metadata } from "next";
import Link from "next/link";
import GrupoPiezas from "@/components/grupo-piezas";
import CieloAurora from "@/components/aurora/cielo-aurora";
import CapituloVelo from "@/components/aurora/capitulo-velo";
import UmbralVestidor from "@/components/aurora/umbral-vestidor";
import {
  porColeccion,
  porTonalidad,
  TIPO_PLURAL,
  TONALIDADES,
  type Tonalidad,
  type TipoPieza,
} from "@/lib/products";
import { CAPITULOS, OBERTURA, CIERRE } from "@/lib/historia";
import s from "./aurora.module.css";

export const metadata: Metadata = {
  title: "Aurora",
  description:
    "Veinte piezas, cuatro momentos. La colección Aurora, de Versé Intimates.",
};

function esTonalidad(valor: string | undefined): valor is Tonalidad {
  return TONALIDADES.some((t) => t.id === valor);
}

const TIPOS_FILTRO: TipoPieza[] = [
  "conjunto",
  "body",
  "corset",
  "bra",
  "panty",
  "tanga",
  "liguero",
  "complemento",
];

const DESCRIPCION_GRUPO: Partial<Record<TipoPieza, string>> = {
  conjunto: "Tres o cuatro prendas pensadas juntas. Cada una se vende también por separado.",
  body: "Una sola pieza, del escote a la cadera.",
  complemento: "Para completar el conjunto: accesorios y capas para llevar encima.",
};

function esTipoPieza(valor: string | undefined): valor is TipoPieza {
  return TIPOS_FILTRO.includes(valor as TipoPieza);
}

export default async function Aurora(props: PageProps<"/aurora">) {
  const query = await props.searchParams;
  const crudo = Array.isArray(query.momento) ? query.momento[0] : query.momento;
  const viewParam = Array.isArray(query.view) ? query.view[0] : query.view;
  const tipoParam = Array.isArray(query.tipo) ? query.tipo[0] : query.tipo;
  const mostraHistoria = viewParam !== "productos";
  const mostrarTodosProductos = viewParam === "productos" && !crudo;
  const filtroTipo = esTipoPieza(tipoParam) ? tipoParam : null;
  const activa: Tonalidad = esTonalidad(crudo) ? crudo : "noctis";

  // En la vista por momento y en «Todos» sin filtro se muestran las piezas
  // principales; las prendas sueltas aparecen bajo su conjunto o al filtrar.
  const fuente = mostrarTodosProductos ? porColeccion("aurora") : porTonalidad(activa);
  const tipos: TipoPieza[] = filtroTipo ? [filtroTipo] : ["conjunto", "body", "complemento"];
  const grupos = tipos
    .map((tipo) => ({ tipo, productos: fuente.filter((p) => p.tipo === tipo) }))
    .filter((g) => g.productos.length > 0);

  return (
    // data-panel: solo para que <Nav/> sepa de qué color pintarse encima
    // (el color real lo definen los tokens propios de .pagina, no este atributo).
    <section
      className={s.pagina}
      data-panel={activa === "borealis" || activa === "prima-luce" ? "seda" : "noche"}
      data-tonalidad={activa}
    >
      <div className="wrap">
        {mostraHistoria ? (
          <header className={s.cabecera}>
            <h1 className={s.marcaColeccion}>
              <span className={s.marcaVerse}>Versé</span>{" "}
              <span className={s.marcaAurora}>Aurora</span>
            </h1>
          </header>
        ) : (
          <h1 className="sr-only">Piezas de Aurora</h1>
        )}

        {/* Historia / Productos */}
        <nav className={s.togglePrincipal} aria-label="Vistas">
          <Link
            href="/aurora?view=productos"
            className={!mostraHistoria ? s.togglePrincipalActivo : ""}
            scroll={false}
          >
            Productos
          </Link>
          <Link
            href="/aurora"
            className={mostraHistoria ? s.togglePrincipalActivo : ""}
            scroll={false}
          >
            Historia
          </Link>
        </nav>
      </div>

      {mostraHistoria ? (
          /* VISTA HISTORIA */
          <article className={s.noche}>
            <CieloAurora />

            <header className={`${s.obertura} wrap`}>
              <p className="label">La colección</p>
              <p className={s.lema}>{OBERTURA.lema}</p>
              <p className={s.cita}>{OBERTURA.cita}</p>
            </header>

            {CAPITULOS.map((c) => {
              const cuerpo = c.versos.slice(0, -1);
              const remate = c.versos[c.versos.length - 1];

              return (
                <section
                  key={c.latin}
                  className={`${s.capitulo} wrap`}
                  data-tonalidad={c.tonalidad}
                  aria-labelledby={`cap-${c.romano}`}
                >
                  <div className={s.marca}>
                    <p className={s.romano} aria-hidden="true">
                      {c.romano}
                    </p>
                    <div className={s.nombre}>
                      <h2 className={s.latin} id={`cap-${c.romano}`}>
                        {c.latin}
                      </h2>
                      <p className={s.promesa}>{c.titulo}</p>
                    </div>
                  </div>

                  <CapituloVelo>
                    <div className={s.versos}>
                      {cuerpo.map((v) => (
                        <p key={v}>{v}</p>
                      ))}
                      <p className={s.remate}>{remate}</p>
                    </div>
                  </CapituloVelo>

                  <UmbralVestidor momento={c.tonalidad} />

                  <Link
                    href={`/aurora?view=productos&momento=${c.tonalidad}`}
                    className={s.enlaceProductos}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className={s.enlaceProductosIcono}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {/* Un moñito de cinta: dos lazos, el nudo y dos colas. */}
                      <path d="M12 11.5C9.6 6.2 3.4 6.8 4.2 10.6c.6 2.9 5.1 2.3 7.8.9Z" />
                      <path d="M12 11.5c2.4-5.3 8.6-4.7 7.8-.9-.6 2.9-5.1 2.3-7.8.9Z" />
                      <circle cx="12" cy="11.5" r="1.3" fill="currentColor" stroke="none" />
                      <path d="M11.4 12.6 9.2 18.6M12.6 12.6l2.2 6" />
                    </svg>
                    <span>Ver las piezas de {c.latin}</span>
                  </Link>
                </section>
              );
            })}

            <footer className={`${s.cierre} wrap`} data-panel="seda">
              <p className={s.cierreFrase}>{CIERRE.primera}</p>
              <p className={s.cierreFrase}>{CIERRE.segunda}</p>
              <div className={s.firma}>
                <Link href="/aurora?view=productos" className="btn">
                  Ver toda la colección
                </Link>
              </div>
            </footer>
          </article>
        ) : (
          /* VISTA PRODUCTOS */
          <div className="wrap">
            <nav className={s.toggle} aria-label="Momento">
              <Link
                href="/aurora?view=productos"
                className={mostrarTodosProductos ? s.toggleActivo : ""}
                scroll={false}
              >
                Todos
              </Link>
              {TONALIDADES.map((t) => (
                <Link
                  key={t.id}
                  href={`/aurora?view=productos&momento=${t.id}`}
                  className={!mostrarTodosProductos && t.id === activa ? s.toggleActivo : ""}
                  scroll={false}
                >
                  {t.nombre}
                </Link>
              ))}
            </nav>

            {mostrarTodosProductos && (
              <nav className={`${s.filtros} label`} aria-label="Tipo de prenda">
                <Link
                  href="/aurora?view=productos"
                  className={!filtroTipo ? s.filtroActivo : ""}
                  scroll={false}
                >
                  Todo
                </Link>
                {TIPOS_FILTRO.map((tipo) => (
                  <Link
                    key={tipo}
                    href={`/aurora?view=productos&tipo=${tipo}`}
                    className={filtroTipo === tipo ? s.filtroActivo : ""}
                    scroll={false}
                  >
                    {TIPO_PLURAL[tipo]}
                  </Link>
                ))}
              </nav>
            )}

            {grupos.map(({ tipo, productos }) => (
              <GrupoPiezas
                key={tipo}
                tipo={tipo}
                productos={productos}
                descripcion={mostrarTodosProductos ? undefined : DESCRIPCION_GRUPO[tipo]}
                conComponentes={!mostrarTodosProductos}
              />
            ))}
          </div>
        )}
    </section>
  );
}
