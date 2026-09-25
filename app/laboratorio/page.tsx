import type { Metadata } from "next";
import {
  Abril_Fatface,
  Gloock,
  IM_Fell_English,
  Old_Standard_TT,
  Sorts_Mill_Goudy,
  Yeseva_One,
} from "next/font/google";
import Image from "next/image";
import Hilo from "@/components/laboratorio/hilo";
import HiloEnlace from "@/components/laboratorio/hilo-enlace";
import { FOTO_PORTADA } from "@/lib/provisional";
import s from "./laboratorio.module.css";

// Candidatas de tipografía: se cargan solo en esta página.
const fell = IM_Fell_English({ weight: "400", style: ["normal", "italic"], subsets: ["latin"] });
const oldStandard = Old_Standard_TT({ weight: ["400", "700"], style: ["normal", "italic"], subsets: ["latin"] });
const goudy = Sorts_Mill_Goudy({ weight: "400", style: ["normal", "italic"], subsets: ["latin"] });
const abril = Abril_Fatface({ weight: "400", subsets: ["latin"] });
const yeseva = Yeseva_One({ weight: "400", subsets: ["latin"] });
const gloock = Gloock({ weight: "400", subsets: ["latin"] });

const TIPOGRAFIAS = [
  {
    nombre: "IM Fell English",
    nota: "Libro antiguo: la tinta imperfecta de la imprenta. La más humana.",
    titulo: fell.className,
    cuerpo: fell.className,
  },
  {
    nombre: "Old Standard TT",
    nota: "Periódico y libro del siglo XIX. La más victoriana editorial.",
    titulo: oldStandard.className,
    cuerpo: oldStandard.className,
  },
  {
    nombre: "Sorts Mill Goudy",
    nota: "Libro clásico de principios del siglo XX, cálido y legible.",
    titulo: goudy.className,
    cuerpo: goudy.className,
  },
  {
    nombre: "Abril Fatface + Old Standard TT",
    nota: "Cartel victoriano de contraste fuerte para títulos; Old Standard para leer.",
    titulo: abril.className,
    cuerpo: oldStandard.className,
  },
  {
    nombre: "Yeseva One + Sorts Mill Goudy",
    nota: "Didona femenina para títulos; Goudy para leer.",
    titulo: yeseva.className,
    cuerpo: goudy.className,
  },
  {
    nombre: "Gloock + IM Fell English",
    nota: "Contraste alto con carácter para títulos; Fell para leer.",
    titulo: gloock.className,
    cuerpo: fell.className,
  },
];

export const metadata: Metadata = {
  title: "Laboratorio",
  robots: { index: false, follow: false },
};

/**
 * Laboratorio del lenguaje visual de Versé. No está en el menú ni en el
 * sitemap: es para probar firmas visuales antes de llevarlas al sitio.
 * Lo que sobreviva aquí pasa a los componentes reales.
 */
export default function Laboratorio() {
  return (
    <div className={s.pagina}>
        <header className={`${s.intro} wrap`}>
          <h1 className={s.introTitulo}>Laboratorio</h1>
          <p>
            Pruebas del lenguaje visual de Versé. Nada de esto está en el sitio
            todavía: aquí se mira, se compara y se decide qué sobrevive.
          </p>
        </header>

        {/* Prueba 1 — Hero */}
        <p className={`${s.nota} wrap`}>
          1. Hero con el logo real: el wordmark completo a todo el ancho, una foto
          pequeña al lado del texto y botones sin píldora.
        </p>
        <section className={s.hero}>
          <div className={s.luz} aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/verse-wordmark-noche.svg" alt="Versé Intimates" className={s.wordmark} />
          <div className={s.heroFila}>
            <div className={s.heroTexto}>
              <p className={s.heroFrase}>
                Ropa interior para la comodidad de cada día y lencería para la noche.
                Diseñada en Medellín.
              </p>
              <div className={s.heroEnlaces}>
                <HiloEnlace href="/aurora">Ver Aurora</HiloEnlace>
                <HiloEnlace href="/productos">Ver todos los productos</HiloEnlace>
              </div>
            </div>
            {FOTO_PORTADA && (
              <div className={s.foto}>
                <Image src={FOTO_PORTADA} alt="" fill sizes="18rem" />
              </div>
            )}
          </div>
        </section>

        {/* Prueba 2 — Tipografía */}
        <p className={`${s.nota} wrap`}>
          2. Tipografía: seis candidatas victorianas y editoriales con el mismo texto.
          Elijan la que suene a Versé (o combinen el título de una con el cuerpo de
          otra).
        </p>
        <section className={`${s.tipos} wrap`}>
          {TIPOGRAFIAS.map((t, i) => (
            <article key={t.nombre} className={s.tipo}>
              <p className={s.tipoNombre}>
                {String.fromCharCode(65 + i)}. {t.nombre}
              </p>
              <p className={`${s.tipoMarca} ${t.titulo}`}>Versé</p>
              <h3 className={`${s.tipoTitulo} ${t.titulo}`}>
                Lo que va debajo merece el mismo cuidado.
              </h3>
              <p className={`${s.tipoCuerpo} ${t.cuerpo}`}>
                Versé diseña ropa interior y lencería. De día, prendas cómodas que se
                olvidan puestas. De noche, la versión más sensual de la misma mujer.
              </p>
              <p className={`${s.tipoCursiva} ${t.cuerpo}`}>
                Una noche. Mil versiones.
              </p>
              <p className={s.tipoNota}>{t.nota}</p>
            </article>
          ))}
        </section>

        {/* Prueba 3 — El hilo */}
        <p className={`${s.nota} wrap`}>
          3. El hilo: reemplaza las líneas rectas. Cuelga con un poco de peso,
          respira y se deja llevar por el cursor. Pasa el mouse por encima y cerca.
        </p>
        <section className={`${s.hiloDemo} wrap`}>
          <h2 className={s.hiloTitulo}>Lo que va debajo merece el mismo cuidado.</h2>
          <Hilo caida={18} alto={120} />
          <p className={s.hiloTexto}>
            Como separador entre secciones, como subrayado de un enlace o
            atravesando una imagen. Siempre el mismo hilo, en oro rosa.
          </p>
          <Hilo caida={6} alto={60} />
        </section>

    </div>
  );
}
