import Link from "next/link";
import Panel from "@/components/panel";
import KeyReveal from "@/components/key-reveal";
import Tela from "@/components/firmas/tela";
import Molderia from "@/components/firmas/molderia";
import TransicionAurora from "@/components/firmas/transicion-aurora";
import { FOTO_PORTADA, IMAGEN_COLECCION } from "@/lib/provisional";
import { getColeccion } from "@/lib/colecciones";
import Image from "next/image";
import { ENTRADAS, formatFecha } from "@/lib/blog";
import s from "./home.module.css";

export default function Home() {

  return (
    <>
      {/* 1 — Hero: la llave (el encaje que el cursor descubre). */}
      <Panel tono="noche" seam={false} padded={false} className={s.hero}>
        <div className={s.luz} aria-hidden="true" />
        <div className={`${s.heroRejilla} wrap`}>
          <div className={s.heroTexto}>
            <h1 className={s.heroPalabra}>Versé</h1>
            <p className={s.heroFrase}>
              Ropa interior para la comodidad de cada día y lencería para la
              noche. Diseñada en Medellín.
            </p>
            <div className={s.heroBotones}>
              <Link href="/aurora" className="btn btn-fg">
                Ver la última colección
              </Link>
              <Link href="/productos" className="btn">
                Ver todos los productos
              </Link>
            </div>
          </div>
          <div className={s.heroFigura}>
            <KeyReveal foto={FOTO_PORTADA} />
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
                Versé diseña ropa interior y lencería. De día, prendas cómodas que
                se olvidan puestas. De noche, la versión más sensual de la misma
                mujer.
              </p>
              <p>
                En cada prenda cuidamos lo que casi nadie ve: dónde apoya un tirante y
                cómo termina un borde.
              </p>
            </div>
          </div>
        </div>
      </Panel>

      {/* La tela: seda que ondula bajo el cursor. */}
      <Tela foto="/texturas/seda-noche.jpg">
        <p className={s.telaTexto}>Una noche. Mil versiones.</p>
      </Tela>

      {/* 3 — Colección vigente: los cuatro momentos de Aurora. */}
      <Panel tono="seda" id="colecciones" seam={false}>
        <div className="wrap">
          <div className={`${s.coleccionCabecera} ${IMAGEN_COLECCION.aurora ? s.conImagen : ""}`}>
            <div className={s.coleccionTexto}>
              <h2 className={s.coleccionTitulo}>Aurora</h2>
              <p className={s.coleccionDescripcion}>
                La colección más reciente. {getColeccion("aurora").descripcion}
              </p>
              <div className={s.coleccionBotones}>
                <Link href="/aurora?view=productos" className="btn btn-fg">
                  Ver la colección
                </Link>
                <Link href="/aurora" className="btn">
                  Leer la historia
                </Link>
              </div>
            </div>
            {IMAGEN_COLECCION.aurora && (
              <div className={s.coleccionMolde}>
                <div className={s.coleccionImagen}>
                  <Image
                    src={IMAGEN_COLECCION.aurora}
                    alt="Productos de la colección Aurora"
                    fill
                    sizes="(max-width: 760px) 100vw, 50vw"
                  />
                </div>
                {["si", "sd", "ii", "id"].map((e) => (
                  <span key={e} className={`${s.marca} ${s[e]}`} aria-hidden="true" />
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Aurora como luz: al bajar, el fondo recorre los cuatro momentos. */}
        <TransicionAurora enlace="/aurora?view=productos" />
      </Panel>

      {/* 4 — Tallas: banda ancha, letras separadas por filetes. */}
      <Panel tono="seda" id="tallas" className={s.tallasPanel}>
        <Molderia className={s.tallasMolde} />
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

      {/* 5 — El diario. */}
      <Panel tono="noche" id="diario">
        <div className="wrap">
          <div className={s.diarioCinta}>
            <h2 className={s.diarioTitulo}>Diario</h2>
            <Link href="/blog" className="label link">
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
