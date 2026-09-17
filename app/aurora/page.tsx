import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/product-card";
import CieloAurora from "@/components/aurora/cielo-aurora";
import CapituloVelo from "@/components/aurora/capitulo-velo";
import UmbralVestidor from "@/components/aurora/umbral-vestidor";
import {
  porTonalidad,
  getTonalidad,
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

const ORDEN_TIPO: TipoPieza[] = ["conjunto", "body", "corset", "complemento"];

export default async function Aurora(props: PageProps<"/aurora">) {
  const query = await props.searchParams;
  const crudo = Array.isArray(query.momento) ? query.momento[0] : query.momento;
  const viewParam = Array.isArray(query.view) ? query.view[0] : query.view;
  const mostraHistoria = viewParam !== "productos";
  const activa: Tonalidad = esTonalidad(crudo) ? crudo : "noctis";

  const tonalidad = getTonalidad(activa);
  const piezas = porTonalidad(activa);

  return (
    // data-panel: solo para que <Nav/> sepa de qué color pintarse encima
    // (el color real lo definen los tokens propios de .pagina, no este atributo).
    <section
      className={s.pagina}
      data-panel={activa === "borealis" || activa === "prima-luce" ? "seda" : "noche"}
      data-tonalidad={activa}
    >
      <div className="wrap">
        <header className={s.cabecera}>
          <p className={`${s.eyebrow} label`}>Colección</p>
          <h1 className={s.titulo}>Aurora</h1>
          <p className={s.intro}>
            Veinte piezas, cuatro momentos. Aurora en su viaje completo del día.
          </p>
        </header>

        {/* Toggle principal: Historia / Productos */}
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

        {mostraHistoria ? (
          /* VISTA HISTORIA */
          <article className={s.noche}>
            <CieloAurora />

            <header className={`${s.obertura} wrap`}>
              <p className="label">La colección</p>
              <h1 className={s.titular}>{OBERTURA.titulo}</h1>
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

                  <UmbralVestidor momento={c.tonalidad} />
                </section>
              );
            })}

            <footer className={`${s.cierre} wrap`} data-panel="seda">
              <p className={s.cierreFrase}>{CIERRE.primera}</p>
              <p className={s.cierreFrase}>{CIERRE.segunda}</p>
              <div className={s.firma}>
                <Link href="/aurora?view=productos" className="btn">
                  Ver la colección
                </Link>
                <span className="label">Aurora · Versé</span>
              </div>
            </footer>
          </article>
        ) : (
          /* VISTA PRODUCTOS */
          <>
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

            <div className={s.mood}>
              <p className={s.sensacion}>{tonalidad.sensacion}.</p>
              <div className={s.swatches} aria-hidden="true">
                {tonalidad.paleta.map((c) => (
                  <span key={c.hex} className={s.swatch} style={{ background: c.hex }} />
                ))}
              </div>
            </div>

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
          </>
        )}
      </div>
    </section>
  );
}
