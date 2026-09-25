import type { Metadata } from "next";
import {
  Bona_Nova,
  Fanwood_Text,
  Gilda_Display,
  IM_Fell_French_Canon,
  IM_Fell_Great_Primer,
  Linden_Hill,
  Oranienbaum,
  Rozha_One,
  Sedan,
} from "next/font/google";
import Image from "next/image";
import Hilo from "@/components/laboratorio/hilo";
import HiloEnlace from "@/components/laboratorio/hilo-enlace";
import { FOTO_PORTADA } from "@/lib/provisional";
import s from "./laboratorio.module.css";

// Candidatas de tipografía, elegidas por ser poco usadas: se cargan solo aquí.
const fellCanon = IM_Fell_French_Canon({ weight: "400", style: ["normal", "italic"], subsets: ["latin"] });
const fellPrimer = IM_Fell_Great_Primer({ weight: "400", style: ["normal", "italic"], subsets: ["latin"] });
const linden = Linden_Hill({ weight: "400", style: ["normal", "italic"], subsets: ["latin"] });
const fanwood = Fanwood_Text({ weight: "400", style: ["normal", "italic"], subsets: ["latin"] });
const gilda = Gilda_Display({ weight: "400", subsets: ["latin"] });
const rozha = Rozha_One({ weight: "400", subsets: ["latin"] });
const oranienbaum = Oranienbaum({ weight: "400", subsets: ["latin"] });
const bona = Bona_Nova({ weight: ["400", "700"], style: ["normal", "italic"], subsets: ["latin"] });
const sedan = Sedan({ weight: "400", style: ["normal", "italic"], subsets: ["latin"] });

const TIPOGRAFIAS = [
  {
    nombre: "IM Fell French Canon + IM Fell Great Primer",
    nota: "Tipos de una imprenta inglesa de 1680, con la tinta imperfecta. Casi nadie las usa en web.",
    titulo: fellCanon.className,
    cuerpo: fellPrimer.className,
  },
  {
    nombre: "Linden Hill",
    nota: "Recuperación de una letra de libro de Frederic Goudy: elegante y rara.",
    titulo: linden.className,
    cuerpo: linden.className,
  },
  {
    nombre: "Fanwood Text",
    nota: "Letra de libro clásico americano, muy fina.",
    titulo: fanwood.className,
    cuerpo: fanwood.className,
  },
  {
    nombre: "Gilda Display + Fanwood Text",
    nota: "Contraste alto con curvas suaves para títulos; Fanwood para leer.",
    titulo: gilda.className,
    cuerpo: fanwood.className,
  },
  {
    nombre: "Rozha One + Linden Hill",
    nota: "Didona gruesa de cartel, poco vista; Linden Hill para leer.",
    titulo: rozha.className,
    cuerpo: linden.className,
  },
  {
    nombre: "Oranienbaum + Bona Nova",
    nota: "Didona rusa de alto contraste con un cuerpo polaco de los setenta.",
    titulo: oranienbaum.className,
    cuerpo: bona.className,
  },
  {
    nombre: "Sedan",
    nota: "Estilo antiguo con cursiva propia.",
    titulo: sedan.className,
    cuerpo: sedan.className,
  },
  {
    nombre: "Bona Nova",
    nota: "Letra de libro polaca con mucha personalidad en la cursiva.",
    titulo: bona.className,
    cuerpo: bona.className,
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
          2. Tipografía: ocho candidatas poco usadas, con el mismo texto. Elegida
          la A (IM Fell French Canon + Great Primer), ya aplicada en todo el sitio.
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
