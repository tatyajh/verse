import type { Metadata } from "next";
import Link from "next/link";
import Panel from "@/components/panel";
import { ENTRADAS, formatFecha } from "@/lib/blog";
import s from "./blog.module.css";

export const metadata: Metadata = {
  title: "Diario",
  description:
    "Notas de Versé: cómo pensamos las colecciones y cómo elegir tu talla.",
};

export default function Blog() {
  return (
    <Panel tono="seda" seam={false}>
      <div className="wrap">
        <header className={s.cabecera}>
          <p className={`${s.eyebrow} label`}>Versé Intimates</p>
          <h1 className={s.titulo}>Diario</h1>
          <p className={s.intro}>
            Lo que escribimos sobre las colecciones, las tallas y cómo
            trabajamos.
          </p>
        </header>

        <ul className={s.lista}>
          {ENTRADAS.map((e) => (
            <li key={e.slug} className={s.fila}>
              <Link href={`/blog/${e.slug}`} className={s.enlace}>
                <time className={`${s.fecha} label num`} dateTime={e.fecha}>
                  {formatFecha(e.fecha)}
                </time>
                <h2 className={s.entradaTitulo}>{e.titulo}</h2>
                <p className={s.resumen}>{e.resumen}</p>
                <span className={`${s.leer} label link`}>Leer</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
