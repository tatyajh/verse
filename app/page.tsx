import type { CSSProperties } from "react";
import Link from "next/link";
import Panel from "@/components/panel";
import ProductCard from "@/components/product-card";
import KeyReveal from "@/components/key-reveal";
import { getProduct, TONALIDADES } from "@/lib/products";
import { ENTRADAS, formatFecha } from "@/lib/blog";
import s from "./home.module.css";

/** Rosa Oro: el acento cruzado del moodboard de Aurora, el mismo que usa /aurora. */
const ACENTO_AURORA = "#B76E79";
const LADO_COLOR = {
  noctis: { bg: "#060608", fg: "#e9e3db" }, // Negro
  vigilia: { bg: "#493B63", fg: "#e9e3db" }, // Morado profundo
  borealis: { bg: "#0F6E56", fg: "#e9e3db" }, // Verde esmeralda
  "prima-luce": { bg: "#E5E1E2", fg: "#493B63" }, // Perla
} as const;

export default function Home() {

  return (
    <>
      {/* 1 — El wordmark es la imagen. No hay foto todavía; no hace falta. */}
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
            De lo cotidiano a lo especial, prendas para acompañar las distintas formas
            en las que decides sentirte tú misma.
          </p>
          <div className={s.heroBotones}>
            <Link href="/aurora" className="btn btn-fg">
              Ver última colección
            </Link>
            <Link href="/aurora?view=productos" className="btn btn-fg">
              Ver todos los productos
            </Link>
          </div>
        </div>
      </Panel>

      {/* 2 — Manifiesto: columnas desiguales, la derecha cae más abajo. */}
      <Panel tono="seda" id="manifiesto">
        <div className="wrap">
          <div className={s.manifiesto}>
            <h2 className={s.manifiestoTitulo}>
              No debería haber que elegir entre una pieza bonita y una que funcione.
            </h2>
            <div className={s.manifiestoCuerpo}>
              <p>
                Versé nace de una idea sencilla: la ropa interior puede acompañar tu día
                y, al mismo tiempo, ser una forma de expresión, seguridad y sensualidad.
                Sin ocasión que esperar y sin nadie a quien pedirle permiso.
              </p>
              <p>
                Cada pieza busca el equilibrio entre comodidad, feminidad, diseño y
                exclusividad. Siluetas, encajes, transparencias, textiles y herrajes se
                eligen con intención y conservan una identidad reconocible como parte del
                universo Versé.
              </p>
              <p className={`${s.rasgos} label`}>
                <span>Femenina</span>
                <span>Romántica</span>
                <span>Sofisticada</span>
                <span>Sensual</span>
                <span>Detallista</span>
              </p>
            </div>
          </div>
        </div>
      </Panel>

      {/* 3 — Aurora es dos tonalidades, así que se muestra como dos paneles. */}
      <Panel tono="seda" id="aurora" seam={false}>
        <div className="wrap">
          <div className={`${s.duoCinta} label`}>
            <span>La colección</span>
            <span>Aurora</span>
          </div>
          <div className={s.duo}>
            {TONALIDADES.map((t) => (
              <Link
                key={t.id}
                href={`/aurora?momento=${t.id}`}
                className={s.lado}
                style={
                  {
                    "--lado-bg": LADO_COLOR[t.id].bg,
                    "--lado-fg": LADO_COLOR[t.id].fg,
                    "--lado-accent": ACENTO_AURORA,
                  } as CSSProperties
                }
              >
                <p className={`${s.ladoIntencion} label`}>{t.nombre}</p>
                <h3 className={s.ladoNombre}>Aurora {t.nombre}</h3>
                <p className={s.ladoSensacion}>{t.sensacion}.</p>
                <div className={s.ladoSwatches} aria-hidden="true">
                  {t.paleta.map((c) => (
                    <span key={c.hex} style={{ background: c.hex }} />
                  ))}
                </div>
                <span className={`${s.ladoLink} label link`}>Explorar {t.nombre}</span>
              </Link>
            ))}
          </div>
        </div>
      </Panel>

      {/* 4 — La llave: el único momento interactivo del sitio. */}
      <Panel tono="noche" id="llave">
        <div className="wrap">
          <div className={s.llave}>
            <div className={s.llaveTexto}>
              <h2 className={s.llaveTitulo}>Versé</h2>
              <p>
                Donde tú y tu sombra se reconocen. Donde lo que ves y lo que eres danzan en el mismo espacio, finalmente en paz.
              </p>
              <p className={s.cita}>
                No somos una sola verdad. Somos el diálogo entre lo que contradice y lo que completa.
              </p>
              <p className={`${s.cita} ${s.citaFirma}`}>
                Aquí tu dualidad es sagrada.
              </p>
            </div>
            <KeyReveal />
          </div>
        </div>
      </Panel>

      {/* 6 — Tallas: banda ancha, letras separadas por filetes. */}
      <Panel tono="seda" id="tallas">
        <div className="wrap">
          <div className={s.tallas}>
            <div className={s.tallasTexto}>
              <h2 className={s.tallasTitulo}>Guía de tallas</h2>
              <p>
                Si estás entre dos tallas, escríbenos con tus medidas y te decimos cuál
                pedir. Cambio de talla sin costo en el primer pedido.
              </p>
            </div>
            <div className={`${s.regla} label`}>
              <span>XS</span>
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

      {/* 7 — El diario. Enlazarlo solo desde el pie lo dejaba enterrado. */}
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
