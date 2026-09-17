import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/product-card";
import CieloAurora from "@/components/aurora/cielo-aurora";
import CapituloVelo from "@/components/aurora/capitulo-velo";
import UmbralVestidor from "@/components/aurora/umbral-vestidor";
import {
  porTonalidad,
  getProduct,
  TIPO_LABEL,
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

function esTipoPieza(valor: string | undefined): valor is TipoPieza {
  const tiposValidos: TipoPieza[] = [
    "conjunto",
    "body",
    "corset",
    "complemento",
    "bra",
    "panty",
    "tanga",
    "liguero",
  ];
  return tiposValidos.includes(valor as TipoPieza);
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

  const piezas = porTonalidad(activa);

  return (
    // data-panel: solo para que <Nav/> sepa de qué color pintarse encima
    // (el color real lo definen los tokens propios de .pagina, no este atributo).
    <section
      className={s.pagina}
      data-panel={activa === "borealis" || activa === "prima-luce" ? "seda" : "noche"}
      data-tonalidad={activa}
    >
      {!mostrarTodosProductos && (
        <div className="wrap">
          {mostraHistoria && (
            <header className={s.cabecera}>
              <h1 className={s.marcaColeccion}>
                <span className={s.marcaVerse}>Versé</span>{" "}
                <span className={s.marcaAurora}>Aurora</span>
              </h1>
            </header>
          )}

          {/* Toggle principal: Historia / Productos */}
          <nav className={s.togglePrincipal} aria-label="Vistas">
            <Link
              href={`/aurora?view=productos&momento=${activa}`}
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
      )}

      {mostraHistoria ? (
          /* VISTA HISTORIA */
          <article className={s.noche}>
            <CieloAurora />

            <header className={`${s.obertura} wrap`}>
              <p className="label">La colección</p>
              <p className={s.lema}>{OBERTURA.lema}</p>
              <p className={s.cita}>{OBERTURA.cita}</p>
            </header>

            {CAPITULOS.map((c, i) => {
              const ultimo = i === CAPITULOS.length - 1;
              const versos = ultimo ? c.versos.slice(0, -1) : c.versos;
              const cuerpo = versos.slice(0, -1);
              const remate = versos[versos.length - 1];

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

                  <Link
                    href={`/aurora?view=productos&momento=${c.tonalidad}`}
                    className={s.enlaceProductos}
                  >
                    <span className={s.enlaceProductosIcono}>◆</span>
                    <span>Ver todo lo que tiene {c.latin} para ti</span>
                  </Link>

                  <UmbralVestidor momento={c.tonalidad} />
                </section>
              );
            })}

            <footer className={`${s.cierre} wrap`} data-panel="seda">
              <p className={s.cierreFrase}>{CIERRE.primera}</p>
              <p className={s.cierreFrase}>{CIERRE.segunda}</p>
              <div className={s.firma}>
                <Link href="/aurora?view=productos" className="btn">
                  Ver Aurora Versé
                </Link>
              </div>
            </footer>
          </article>
        ) : (
          /* VISTA PRODUCTOS */
          <>
            {!mostrarTodosProductos && (
              <nav className={s.toggle} aria-label="Momento">
                {TONALIDADES.map((t) => {
                  const cap = CAPITULOS.find(c => c.tonalidad === t.id);
                  return (
                    <Link
                      key={t.id}
                      href={`/aurora?view=productos&momento=${t.id}`}
                      className={t.id === activa ? s.toggleActivo : ""}
                      scroll={false}
                    >
                      {t.nombre}
                      {cap && (
                        <span className={s.toggleLatin}>
                          {cap.romano.toLowerCase()}. {cap.latin.toLowerCase()}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            )}

            {mostrarTodosProductos ? (
              /* Mostrar TODOS los productos de todas las tonalidades */
              <div className="wrap">
                <div style={{ marginBottom: "3rem", marginTop: "2rem" }}>
                  <div style={{ marginBottom: "1.5rem" }}>
                    <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
                      Filtrar por tipo:
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.75rem",
                      }}
                    >
                      <Link
                        href="/aurora?view=productos"
                        scroll={false}
                        style={{
                          padding: "0.5rem 1rem",
                          border: `1px solid ${!filtroTipo ? "var(--accent)" : "var(--line)"}`,
                          background: !filtroTipo ? "var(--accent)" : "transparent",
                          color: !filtroTipo ? "var(--bg)" : "var(--fg)",
                          cursor: "pointer",
                          borderRadius: "999px",
                          fontSize: "0.875rem",
                          fontWeight: !filtroTipo ? "600" : "400",
                          transition: "all 0.3s ease",
                          fontFamily: "var(--font-ui), system-ui, sans-serif",
                          textDecoration: "none",
                          display: "inline-block",
                        }}
                      >
                        Todos
                      </Link>
                      {["conjunto", "body", "corset", "bra", "panty", "tanga", "liguero", "complemento"].map(
                        (tipo) => (
                          <Link
                            key={tipo}
                            href={`/aurora?view=productos&tipo=${tipo}`}
                            scroll={false}
                            style={{
                              padding: "0.5rem 1rem",
                              border: `1px solid ${filtroTipo === tipo ? "var(--accent)" : "var(--line)"}`,
                              background: filtroTipo === tipo ? "var(--accent)" : "transparent",
                              color: filtroTipo === tipo ? "var(--bg)" : "var(--fg)",
                              cursor: "pointer",
                              borderRadius: "999px",
                              fontSize: "0.875rem",
                              fontWeight: filtroTipo === tipo ? "600" : "400",
                              transition: "all 0.3s ease",
                              fontFamily: "var(--font-ui), system-ui, sans-serif",
                              textDecoration: "none",
                              display: "inline-block",
                            }}
                          >
                            {TIPO_LABEL[tipo as TipoPieza] || tipo}
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Obtener TODOS los productos de TODAS las tonalidades */}
                {(() => {
                  const todosPorMomento = TONALIDADES.flatMap((t) => porTonalidad(t.id));
                  const todosFiltrados = filtroTipo
                    ? todosPorMomento.filter((p) => p.tipo === filtroTipo)
                    : todosPorMomento;

                  if (filtroTipo) {
                    // Si hay filtro, agrupar por tipo y mostrar
                    const productosPorTipo = todosFiltrados.reduce(
                      (acc, p) => {
                        if (!acc[p.tipo]) acc[p.tipo] = [];
                        acc[p.tipo].push(p);
                        return acc;
                      },
                      {} as Record<string, typeof todosFiltrados>
                    );

                    return Object.entries(productosPorTipo).map(([tipo, productos]) => (
                      <div key={tipo} className={s.grupo}>
                        <div className={`${s.grupoCinta} label`}>
                          <div>
                            <h3 className={s.grupoTitulo}>
                              {TIPO_LABEL[tipo as TipoPieza] || tipo}s
                            </h3>
                          </div>
                          <span>{productos.length}</span>
                        </div>
                        <div className={s.rejilla}>
                          {productos.map((p) => (
                            <ProductCard
                              key={p.slug}
                              producto={p}
                              sizes="(max-width: 560px) 100vw, (max-width: 860px) 50vw, 33vw"
                            />
                          ))}
                        </div>
                      </div>
                    ));
                  } else {
                    // Sin filtro, agrupar por tipo: Conjuntos, Bodies, Complementos
                    return (
                      <>
                        {/* Conjuntos */}
                        {(() => {
                          const conjuntos = todosFiltrados.filter((p) => p.tipo === "conjunto");
                          if (conjuntos.length === 0) return null;
                          return (
                            <div className={s.grupo}>
                              <div className={`${s.grupoCinta} label`}>
                                <div>
                                  <h3 className={s.grupoTitulo}>{TIPO_LABEL["conjunto"]}s</h3>
                                </div>
                                <span>{conjuntos.length}</span>
                              </div>
                              <div className={s.rejilla}>
                                {conjuntos.map((conjunto) => (
                                  <ProductCard
                                    key={conjunto.slug}
                                    producto={conjunto}
                                    sizes="(max-width: 560px) 100vw, (max-width: 860px) 50vw, 33vw"
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Bodies */}
                        {(() => {
                          const bodies = todosFiltrados.filter((p) => p.tipo === "body");
                          if (bodies.length === 0) return null;
                          return (
                            <div className={s.grupo}>
                              <div className={`${s.grupoCinta} label`}>
                                <div>
                                  <h3 className={s.grupoTitulo}>{TIPO_LABEL["body"]}s</h3>
                                </div>
                                <span>{bodies.length}</span>
                              </div>
                              <div className={s.rejilla}>
                                {bodies.map((p) => (
                                  <ProductCard
                                    key={p.slug}
                                    producto={p}
                                    sizes="(max-width: 560px) 100vw, (max-width: 860px) 50vw, 33vw"
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Complementos */}
                        {(() => {
                          const complementos = todosFiltrados.filter((p) => p.tipo === "complemento");
                          if (complementos.length === 0) return null;
                          return (
                            <div className={s.grupo}>
                              <div className={`${s.grupoCinta} label`}>
                                <div>
                                  <h3 className={s.grupoTitulo}>{TIPO_LABEL["complemento"]}s</h3>
                                </div>
                                <span>{complementos.length}</span>
                              </div>
                              <div className={s.rejilla}>
                                {complementos.map((p) => (
                                  <ProductCard
                                    key={p.slug}
                                    producto={p}
                                    sizes="(max-width: 560px) 100vw, (max-width: 860px) 50vw, 33vw"
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </>
                    );
                  }
                })()}
              </div>
            ) : (
              /* Mostrar productos del MOMENTO específico */
              <div className="wrap">
                {/* Conjuntos con componentes individuales */}
                {(() => {
                  const conjuntos = piezas.filter((p) => p.tipo === "conjunto");
                  if (conjuntos.length > 0) {
                    return (
                      <div className={s.grupo}>
                        <div className={`${s.grupoCinta} label`}>
                          <div>
                            <h2 className={s.grupoTitulo}>{TIPO_LABEL["conjunto"]}s</h2>
                            <p className={s.grupoDescripcion}>Sets de 3 o 4 piezas coordinadas: bra, panty, tanga y opcionales.</p>
                          </div>
                          <span>{conjuntos.length}</span>
                        </div>
                        <div className={s.rejilla}>
                          {conjuntos.map((conjunto) => (
                            <div key={conjunto.slug} className={s.conjuntoBloque}>
                              <ProductCard
                                producto={conjunto}
                                sizes="(max-width: 560px) 100vw, (max-width: 860px) 50vw, 33vw"
                              />
                              {conjunto.componentes && conjunto.componentes.length > 0 && (
                                <div className={s.componentesSection}>
                                  <p className={`${s.componentesLabel} label`}>O compra por separado:</p>
                                  <div className={s.componentesGrid}>
                                    {conjunto.componentes
                                      .map((slug) => getProduct(slug))
                                      .filter(Boolean)
                                      .map((comp) => (
                                        <ProductCard
                                          key={comp!.slug}
                                          producto={comp!}
                                          sizes="(max-width: 560px) 100vw, (max-width: 860px) 50vw, 25vw"
                                        />
                                      ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Bodies */}
                {(() => {
                  const bodies = piezas.filter((p) => p.tipo === "body");
                  if (bodies.length === 0) return null;
                  return (
                    <div className={s.grupo}>
                      <div className={`${s.grupoCinta} label`}>
                        <div>
                          <h2 className={s.grupoTitulo}>{TIPO_LABEL["body"]}s</h2>
                          <p className={s.grupoDescripcion}>Prendas de una sola pieza que combinan confort y diseño.</p>
                        </div>
                        <span>{bodies.length}</span>
                      </div>
                      <div className={s.rejilla}>
                        {bodies.map((p) => (
                          <ProductCard
                            key={p.slug}
                            producto={p}
                            sizes="(max-width: 560px) 100vw, (max-width: 860px) 50vw, 33vw"
                          />
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Complementos */}
                {(() => {
                  const complementos = piezas.filter((p) => p.tipo === "complemento");
                  if (complementos.length === 0) return null;
                  return (
                    <div className={s.grupo}>
                      <div className={`${s.grupoCinta} label`}>
                        <div>
                          <h2 className={s.grupoTitulo}>{TIPO_LABEL["complemento"]}s</h2>
                          <p className={s.grupoDescripcion}>Accesorios y prendas de abrigo para completar tu look.</p>
                        </div>
                        <span>{complementos.length}</span>
                      </div>
                      <div className={s.rejilla}>
                        {complementos.map((p) => (
                          <ProductCard
                            key={p.slug}
                            producto={p}
                            sizes="(max-width: 560px) 100vw, (max-width: 860px) 50vw, 33vw"
                          />
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </>
        )}
    </section>
  );
}
