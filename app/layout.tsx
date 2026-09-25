import type { Metadata } from "next";
import { Archivo, Bodoni_Moda, Pinyon_Script, Spectral } from "next/font/google";
import "./globals.css";
import Umbral from "@/components/umbral";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { SITE } from "@/lib/sitio";

/* Display: Bodoni Moda para títulos y el wordmark. */
const display = Bodoni_Moda({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

/* Caligráfica: solo lema y citas, nunca en texto corrido ni por debajo
   de 1.5rem (a ese tamaño deja de leerse). */
const script = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

/* Cuerpo. */
const body = Spectral({
  weight: ["300", "400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

/* Interfaz: nav, tallas y precios en mayúsculas pequeñas. */
const ui = Archivo({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Versé Intimates",
    template: "%s — Versé Intimates",
  },
  description:
    "Lencería diseñada en Medellín. Conjuntos, bodies y piezas sueltas. Envíos a toda Colombia.",
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Versé Intimates",
    title: "Versé Intimates",
    description: "Lencería diseñada en Medellín.",
  },
  robots: { index: true, follow: true },
};

/**
 * Decide, antes del primer pintado, si esta visita ve abrirse la caja.
 * Vive en el layout (componente de servidor) para que se ejecute al parsear
 * el HTML: dentro de un componente cliente React no lo ejecutaría.
 */
const DECIDIR_UMBRAL = `(function(){try{
var visto=sessionStorage.getItem("verse.umbral");
var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.dataset.umbral=(visto||reduce)?"visto":"nuevo";
}catch(e){document.documentElement.dataset.umbral="visto";}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      // el script de arriba escribe data-umbral antes de hidratar
      suppressHydrationWarning
      className={`${display.variable} ${script.variable} ${body.variable} ${ui.variable}`}
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: DECIDIR_UMBRAL }} />
        <a className="skip" href="#contenido">
          Saltar al contenido
        </a>
        <Umbral />
        <Nav />
        <main id="contenido">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
