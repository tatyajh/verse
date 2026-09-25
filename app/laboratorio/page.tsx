import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Hilo from "@/components/laboratorio/hilo";
import HiloEnlace from "@/components/laboratorio/hilo-enlace";
import CursorLlave from "@/components/laboratorio/cursor-llave";
import { FOTO_PORTADA } from "@/lib/provisional";
import s from "./laboratorio.module.css";

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
    <CursorLlave>
      <div className={s.pagina}>
        <header className={`${s.intro} wrap`}>
          <h1 className={s.introTitulo}>Laboratorio</h1>
          <p>
            Pruebas del lenguaje visual de Versé. Nada de esto está en el sitio
            todavía: aquí se mira, se compara y se decide qué sobrevive. En toda
            esta página el cursor es la llave del logo.
          </p>
        </header>

        {/* Prueba 1 — Hero */}
        <p className={`${s.nota} wrap`}>
          1. Hero con el logo real: el wordmark enorme, cortado por el borde de la
          pantalla, una foto pequeña que lo interrumpe y botones sin píldora.
        </p>
        <section className={s.hero}>
          <div className={s.luz} aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/verse-wordmark-noche.svg" alt="Versé Intimates" className={s.wordmark} />
          {FOTO_PORTADA && (
            <div className={s.foto}>
              <Image src={FOTO_PORTADA} alt="" fill sizes="18rem" />
            </div>
          )}
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
        </section>

        {/* Prueba 2 — El hilo */}
        <p className={`${s.nota} wrap`}>
          2. El hilo: reemplaza las líneas rectas. Cuelga con un poco de peso,
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

        {/* Prueba 3 — La llave como cursor */}
        <p className={`${s.nota} wrap`}>
          3. La llave como cursor: pasa sobre cualquier cosa que se pueda abrir y
          la llave gira, como dentro de una cerradura.
        </p>
        <section className={`${s.llaveDemo} wrap`}>
          <Link href="/aurora" className={s.puerta}>
            Aurora
          </Link>
          <Link href="/productos" className={s.puerta}>
            Productos
          </Link>
          <Link href="/blog" className={s.puerta}>
            Diario
          </Link>
        </section>
      </div>
    </CursorLlave>
  );
}
