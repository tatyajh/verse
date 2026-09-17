import type { Metadata } from "next";
import Link from "next/link";
import CieloAurora from "@/components/aurora/cielo-aurora";
import CapituloVelo from "@/components/aurora/capitulo-velo";
import UmbralVestidor from "@/components/aurora/umbral-vestidor";
import { CAPITULOS, CIERRE, OBERTURA } from "@/lib/historia";
import s from "./historia.module.css";

export const metadata: Metadata = {
  title: "Aurora — la historia",
  description:
    "Una noche. Mil versiones. El relato de la colección Aurora, en cuatro momentos: Noctis, Vigilia, Borealis y Prima Luce.",
};

export default function Historia() {
  return (
    // data-panel: para que <Nav/> sepa de qué color pintarse encima. El
    // color real lo pone el cielo, que es fixed y va por detrás de todo.
    <article className={s.noche} data-panel="noche">
      <CieloAurora />

      <header className={`${s.obertura} wrap`}>
        <p className="label">La colección</p>
        <h1 className={s.titular}>{OBERTURA.titulo}</h1>
        <p className={s.lema}>{OBERTURA.lema}</p>
        <p className={s.cita}>{OBERTURA.cita}</p>
      </header>

      {CAPITULOS.map((c, i) => {
        // El último verso del relato no se lee aquí: se promueve al cierre
        // de la página, que es donde se convierte en el lema de Aurora.
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
          <Link href="/aurora" className="btn">
            Ver la colección
          </Link>
          <span className="label">Aurora · Versé</span>
        </div>
      </footer>
    </article>
  );
}
