import type { CSSProperties } from "react";
import Link from "next/link";
import Panel from "@/components/panel";
import ProductCard from "@/components/product-card";
import KeyReveal from "@/components/key-reveal";
import { getProduct, TONALIDADES } from "@/lib/products";
import s from "./home.module.css";

/** Rosa Oro: el acento cruzado del moodboard de Aurora, el mismo que usa /aurora. */
const ACENTO_AURORA = "#B76E79";
const LADO_COLOR = {
  nocturna: { bg: "#080D18", fg: "#E9E3DB" },
  diurna: { bg: "#F4EEE5", fg: "#2B1C3D" },
} as const;

const DETALLE = [
  {
    clave: "Textiles",
    titulo: "Encaje francés y tul bordado",
    texto:
      "Elásticos que sostienen sin marcar y encajes que conservan su caída después de varios lavados. Lo que decide si una pieza vuelve al cajón o al cuerpo.",
  },
  {
    clave: "Herrajes",
    titulo: "Acabados en rose gold",
    texto:
      "Argollas, reguladores y broches en rose gold, elegidos pieza por pieza. Es la firma de la casa y el detalle que se reconoce sin leer una etiqueta.",
  },
  {
    clave: "Ajuste",
    titulo: "Tallaje probado en cuerpos reales",
    texto:
      "Cada talla se prueba y se corrige antes de producirse, y se sigue corrigiendo con lo que cuentan quienes ya la usan.",
  },
  {
    clave: "Empaque",
    titulo: "Una caja que se abre despacio",
    texto:
      "Papel seda, sello con la llave y una bolsa interna para guardar la pieza. La experiencia empieza antes de ponérsela.",
  },
];

const SLUGS_DESTACADOS = ["aurora-eclipse", "aurora-alba", "aurora-onix"] as const;

export default function Home() {
  const destacados = SLUGS_DESTACADOS.map((slug) => getProduct(slug)!);

  return (
    <>
      {/* 1 — El wordmark es la imagen. No hay foto todavía; no hace falta. */}
      <Panel tono="noche" seam={false} padded={false} className={s.hero}>
        <div className={s.heroEje} />

        <div className={`${s.heroCinta} wrap label`}>
          <span>Lencería de diseño</span>
          <span>Medellín, Colombia</span>
        </div>

        <div className={s.heroPalabraFila}>
          <h1 className={s.heroPalabra}>VERSÉ</h1>
        </div>

        <div className={`${s.heroPie} wrap`}>
          <p className={s.heroFrase}>
            De lo cotidiano a lo especial, lencería para acompañar las distintas formas
            en las que decides sentirte tú misma.
          </p>
          <Link href="/aurora" className="btn btn-fg">
            Ver última colección
          </Link>
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
                href={`/aurora?tonalidad=${t.id}`}
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

      {/* 4 — Tres piezas de Aurora, desfasadas para que no lean como catálogo. */}
      <Panel tono="seda" seam={false}>
        <div className="wrap">
          <div className={s.destacadoCinta}>
            <h2 className={s.destacadoTitulo}>De la colección Aurora</h2>
            <Link href="/aurora" className="label link">
              Ver las veinte piezas
            </Link>
          </div>
          <div className={s.vitrina}>
            {destacados.map((producto, i) => (
              <ProductCard
                key={producto.slug}
                producto={producto}
                priority={i === 0}
                sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
              />
            ))}
          </div>
        </div>
      </Panel>

      {/* 5 — La llave: el único momento interactivo del sitio. */}
      <Panel tono="noche" id="llave">
        <div className="wrap">
          <div className={s.llave}>
            <div className={s.llaveTexto}>
              <p className="label muted">El símbolo</p>
              <h2 className={s.llaveTitulo}>Detrás del encaje.</h2>
              <p>
                Aparece en los herrajes, en el sello del empaque y en cada pieza de la
                casa: el detalle que hace reconocible a Versé sin necesidad de una
                etiqueta a la vista.
              </p>
              <p className={s.cita}>
                Sentirse bien con una misma no debería depender de una ocasión, de otra
                persona o de que alguien vea lo que llevamos puesto.
              </p>
            </div>
            <KeyReveal />
          </div>
        </div>
      </Panel>

      {/* 6 — Detalle: lista tipográfica. Sin tarjetas, sin iconos. */}
      <Panel tono="noche" seam={false}>
        <div className="wrap">
          <h2 className={s.detalleTitulo}>
            Lo que no se ve en una foto decide si vuelves a usarla.
          </h2>
          <dl className={s.lista}>
            {DETALLE.map((fila) => (
              <div key={fila.clave} className={s.fila}>
                <dt className={`${s.filaClave} label`}>{fila.clave}</dt>
                <dd className={s.filaTitulo}>{fila.titulo}</dd>
                <dd className={s.filaTexto}>{fila.texto}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Panel>

      {/* 7 — Tallas: banda ancha, letras separadas por filetes. */}
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
        </div>
      </Panel>
    </>
  );
}
