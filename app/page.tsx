import type { CSSProperties } from "react";
import Link from "next/link";
import Panel from "@/components/panel";
import KeyReveal from "@/components/key-reveal";
import { TONALIDADES } from "@/lib/products";
import { ENTRADAS, formatFecha } from "@/lib/blog";
import s from "./home.module.css";

/** Rosa Oro: el acento cruzado del moodboard de Aurora, el mismo que usa /aurora.
    Sobre la perla del amanecer se pierde: ahí manda el bronce hondo. */
const ACENTO_AURORA = "#B76E79";
const LADO_COLOR = {
  noctis: { bg: "#060608", fg: "#e9e3db", accent: ACENTO_AURORA }, // Negro
  vigilia: { bg: "#493B63", fg: "#e9e3db", accent: ACENTO_AURORA }, // Morado profundo
  borealis: { bg: "#0F6E56", fg: "#e9e3db", accent: ACENTO_AURORA }, // Verde esmeralda
  "prima-luce": { bg: "#E5E1E2", fg: "#493B63", accent: "#C4734A" }, // Perla
} as const;

export default function Home() {

  return (
    <>
      {/* 1 — Hero: el wordmark hace de imagen mientras no haya fotos. */}
      <Panel tono="noche" seam={false} padded={false} className={s.hero}>
        <div className={s.heroEje} />

        <div className={`${s.heroCinta} wrap label`}>
          <span>Medellín, Colombia</span>
        </div>

        <div className={s.heroPalabraFila}>
          <h1 className={s.heroPalabra}>VERSÉ</h1>
        </div>

        <div className={`${s.heroPie} wrap`}>
          <p className={s.heroFrase}>
            Lencería diseñada en Medellín. Para el día entero, o para una sola
            noche.
          </p>
          <div className={s.heroBotones}>
            <Link href="/aurora?view=productos" className="btn btn-fg">
              Descubrir Aurora
            </Link>
            <Link href="/aurora" className="label link">
              La historia
            </Link>
          </div>
        </div>
      </Panel>

      {/* 2 — Manifiesto: columnas desiguales, la derecha cae más abajo. */}
      <Panel tono="seda" id="manifiesto">
        <div className="wrap">
          <div className={s.manifiesto}>
            <h2 className={s.manifiestoTitulo}>
              Lo que va debajo merece el mismo cuidado.
            </h2>
            <div className={s.manifiestoCuerpo}>
              <p>
                Versé diseña lencería para mujeres que no reservan lo bello para una
                ocasión. Encaje, transparencias y herrajes pensados para acompañar el
                día entero, y la noche que no estaba en los planes.
              </p>
              <p>
                En cada pieza cuidamos lo que casi nadie ve: dónde apoya un tirante,
                cómo termina un borde, qué se muestra y qué apenas se insinúa.
              </p>
            </div>
          </div>
        </div>
      </Panel>

      {/* 3 — Colección vigente: los cuatro momentos de Aurora. */}
      <Panel tono="seda" id="colecciones" seam={false}>
        <div className="wrap">
          <div className={`${s.duoCinta} label`}>
            <span>La colección</span>
            <span>Aurora</span>
          </div>
          <div className={s.duo}>
            {TONALIDADES.map((t) => (
              <Link
                key={t.id}
                href={`/aurora?view=productos&momento=${t.id}`}
                className={s.lado}
                style={
                  {
                    "--lado-bg": LADO_COLOR[t.id].bg,
                    "--lado-fg": LADO_COLOR[t.id].fg,
                    "--lado-accent": LADO_COLOR[t.id].accent,
                  } as CSSProperties
                }
              >
                <p className={`${s.ladoIntencion} label`}>{t.nombre}</p>
                <h3 className={s.ladoNombre}>Aurora {t.nombre}</h3>
                <p className={s.ladoSensacion}>{t.sensacion}</p>
                <div className={s.ladoSwatches} aria-hidden="true">
                  {t.paleta.map((c) => (
                    <span key={c.hex} style={{ background: c.hex }} />
                  ))}
                </div>
                <span className={`${s.ladoLink} label link`}>Ver {t.nombre}</span>
              </Link>
            ))}
          </div>
        </div>
      </Panel>

      {/* 4 — La llave: el encaje que se descubre con el cursor. */}
      <Panel tono="noche" id="llave">
        <div className="wrap">
          <div className={s.llave}>
            <div className={s.llaveTexto}>
              <h2 className={s.llaveTitulo}>Versé</h2>
              <p>
                La llave es el emblema de la casa: el herraje que abre lo que se
                guarda.
              </p>
              <p className={s.cita}>Cada una decide qué abre.</p>
              <p className={`${s.cita} ${s.citaFirma}`}>Y para quién.</p>
            </div>
            <KeyReveal />
          </div>
        </div>
      </Panel>

      {/* 5 — Tallas: banda ancha, letras separadas por filetes. */}
      <Panel tono="seda" id="tallas">
        <div className="wrap">
          <div className={s.tallas}>
            <div className={s.tallasTexto}>
              <h2 className={s.tallasTitulo}>Guía de tallas</h2>
              <p>
                Si estás entre dos tallas, escríbenos con tus medidas y te recomendamos
                la indicada. El primer cambio de talla corre por nuestra cuenta.
              </p>
            </div>
            <div className={`${s.regla} label`}>
              <span>S</span>
              <span>M</span>
              <span>L</span>
              <span>XL</span>
            </div>
          </div>

          <div className={s.tablaTallas}>
            <table>
              <thead>
                <tr>
                  <th>Talla</th>
                  <th>Busto</th>
                  <th>Cintura</th>
                  <th>Cadera</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>S</td>
                  <td>84-88 cm</td>
                  <td>60-66 cm</td>
                  <td>90-95 cm</td>
                </tr>
                <tr>
                  <td>M</td>
                  <td>89-93 cm</td>
                  <td>67-74 cm</td>
                  <td>96-101 cm</td>
                </tr>
                <tr>
                  <td>L</td>
                  <td>94-98 cm</td>
                  <td>75-82 cm</td>
                  <td>102-108 cm</td>
                </tr>
                <tr>
                  <td>XL</td>
                  <td>99-103 cm</td>
                  <td>83-90 cm</td>
                  <td>109-115 cm</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Panel>

      {/* 6 — El diario. */}
      <Panel tono="noche" id="diario">
        <div className="wrap">
          <div className={`${s.diarioCinta} label`}>
            <span>Del diario</span>
            <Link href="/blog" className="link">
              Ver todo
            </Link>
          </div>
          <ul className={s.diario}>
            {ENTRADAS.slice(0, 2).map((e) => (
              <li key={e.slug}>
                <Link href={`/blog/${e.slug}`} className={s.entrada}>
                  <time className={`${s.entradaFecha} label num`} dateTime={e.fecha}>
                    {formatFecha(e.fecha)}
                  </time>
                  <h3 className={s.entradaTitulo}>{e.titulo}</h3>
                  <p className={s.entradaResumen}>{e.resumen}</p>
                  <span className={`${s.entradaLeer} label link`}>Leer</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Panel>
    </>
  );
}
