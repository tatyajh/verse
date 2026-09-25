import type { Metadata } from "next";
import { IM_Fell_French_Canon, IM_Fell_Great_Primer } from "next/font/google";
import "./globals.css";
import Umbral from "@/components/umbral";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { SITE } from "@/lib/sitio";
import { ACTIVO as PROVISIONAL } from "@/lib/provisional";

/* Dos cortes de los tipos Fell, de una imprenta inglesa de finales del
   siglo XVII: French Canon (cuerpo grande) para el nombre, títulos y citas;
   Great Primer para todo lo demás. Solo existen en peso normal, con su tinta
   irregular: es parte del carácter de la marca. */
const display = IM_Fell_French_Canon({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = IM_Fell_Great_Primer({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});



export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Versé Intimates",
    template: "%s — Versé Intimates",
  },
  description:
    "Ropa interior y lencería diseñadas en Medellín: comodidad para el día y sensualidad para la noche. Envíos a toda Colombia.",
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Versé Intimates",
    title: "Versé Intimates",
    description: "Ropa interior y lencería diseñadas en Medellín.",
  },
  // Con fotos provisionales el sitio es de pruebas: no se indexa.
  robots: { index: !PROVISIONAL, follow: !PROVISIONAL },
};

/**
 * Decide antes del primer pintado si esta visita ve abrirse la caja (una vez
 * por sesión). Va en el layout, que es de servidor, para que corra al parsear
 * el HTML; dentro de un componente cliente React no lo ejecutaría.
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
      // el script de abajo escribe data-umbral antes de hidratar
      suppressHydrationWarning
      className={`${display.variable} ${body.variable}`}
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
