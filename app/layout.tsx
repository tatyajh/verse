import type { Metadata } from "next";
import { Bodoni_Moda, Spectral } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { SITE } from "@/lib/sitio";

/* Dos familias: Bodoni Moda para títulos y citas (su cursiva reemplaza a la
   caligráfica), Spectral para todo lo demás, incluidas etiquetas y precios. */
const display = Bodoni_Moda({
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable}`}
    >
      <body>
        <a className="skip" href="#contenido">
          Saltar al contenido
        </a>
        <Nav />
        <main id="contenido">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
