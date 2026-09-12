import { PALETA_AURORA_DIURNA, PALETA_AURORA_NOCTURNA, type PaletaGrabado } from "@/components/lace-canvas";

/**
 * Catálogo — fuente única de verdad.
 *
 * Precios y nombres son marcador de posición hasta que Versé confirme la
 * primera producción. Para cambiarlos no hay que tocar ningún componente.
 *
 * El servidor SIEMPRE recalcula totales desde aquí: nada de lo que llegue
 * del navegador decide cuánto se cobra.
 *
 * Dos formas de catálogo conviven aquí:
 *  - Las tres líneas originales (diario/ritual/velada), un espectro.
 *  - La colección Aurora, aparte: dos tonalidades (nocturna/diurna) que
 *    cruzan con el tipo de pieza (conjunto/body/complemento). Ver más abajo.
 */

export type Linea = "diario" | "ritual" | "velada";

export type Talla = "XS" | "S" | "M" | "L" | "XL" | "Única";

type Comun = {
  slug: string;
  nombre: string;
  /**
   * Pesos colombianos, sin decimales. Ausente = todavía no hay precio
   * confirmado; el storefront lo muestra como "por confirmar" y no deja
   * añadir la pieza al carrito.
   */
  precio?: number;
  /**
   * resumen/descripcion ausentes = todavía no hay copy real para la pieza.
   * No se rellenan con texto inventado: mejor no decir nada que describir
   * mal una prenda que Versé todavía no ha definido.
   */
  resumen?: string;
  descripcion?: string;
  /**
   * Ficha técnica de composición (uso interno: producción, no venta). A
   * quien compra no le interesa el desglose en %; nunca se renderiza en el
   * storefront. Vive aquí solo como referencia para quien produce la pieza.
   */
  materiales?: string[];
  cuidado?: string;
  tallas: Talla[];
  /** Ruta a fotografía real. Mientras no exista, se dibuja el grabado de encaje. */
  image?: string;
  /**
   * Secuencia de fotos para el giro 360° (mínimo 2, en orden de rotación).
   * Mientras no exista, <VisorPieza> muestra la imagen fija de siempre —
   * el visor ya está listo para cuando haya fotografía real de producto.
   */
  giro?: string[];
};

export type LineaProduct = Comun & {
  coleccion?: undefined;
  linea: Linea;
};

export type Tonalidad = "nocturna" | "diurna";
export type TipoPieza = "conjunto" | "body" | "complemento";

export type AuroraProduct = Comun & {
  coleccion: "aurora";
  tonalidad: Tonalidad;
  tipo: TipoPieza;
  /**
   * Solo en conjuntos: cuántas piezas trae (3 o 4, según si incluye liguero
   * u otro complemento). Es la única certeza que hay todavía sobre el
   * contenido del set — no se inventa cuáles son esas piezas.
   */
  piezas?: number;
};

export type Product = LineaProduct | AuroraProduct;

export function esAurora(p: Product): p is AuroraProduct {
  return p.coleccion === "aurora";
}

export type LineaInfo = {
  id: Linea;
  nombre: string;
  intencion: string;
  descripcion: string;
};

/**
 * Las tres líneas son un espectro real —de lo cotidiano a lo especial—, por eso
 * el orden importa y se comunica como recorrido, no como catálogo de categorías.
 */
export const LINEAS: LineaInfo[] = [
  {
    id: "diario",
    nombre: "Diario",
    intencion: "Todos los días",
    descripcion:
      "Siluetas suaves, sin costuras a la vista, tejidos que se olvidan sobre la piel. Comodidad real con el detalle que la hace Versé.",
  },
  {
    id: "ritual",
    nombre: "Ritual",
    intencion: "Para ti",
    descripcion:
      "Encajes florales, herrajes rose gold y transparencias medidas. Piezas que eliges un martes cualquiera, sin motivo y sin público.",
  },
  {
    id: "velada",
    nombre: "Velada",
    intencion: "Edición limitada",
    descripcion:
      "Bordados, tules y acabados a mano. Diseños más elaborados, producidos en cantidades cortas.",
  },
];

export type TonalidadInfo = {
  id: Tonalidad;
  nombre: string;
  sensacion: string;
  paleta: { nombre: string; hex: string }[];
  grabado: PaletaGrabado;
};

/** Las dos tonalidades de Aurora — el moodboard que envió la marca. */
export const TONALIDADES: TonalidadInfo[] = [
  {
    id: "nocturna",
    nombre: "Nocturna",
    sensacion: "Profundidad, misterio, magnetismo",
    paleta: [
      { nombre: "Noche boreal", hex: "#080D18" },
      { nombre: "Negro eclipse", hex: "#111111" },
      { nombre: "Petróleo aurora", hex: "#12484B" },
      { nombre: "Morado abismo", hex: "#2B1C3D" },
      { nombre: "Violeta pulsar", hex: "#5D4772" },
    ],
    grabado: PALETA_AURORA_NOCTURNA,
  },
  {
    id: "diurna",
    nombre: "Diurna",
    sensacion: "Calma, feminidad, luz etérea",
    paleta: [
      { nombre: "Azul escarcha", hex: "#9EADB9" },
      { nombre: "Verde niebla", hex: "#AAB9AC" },
      { nombre: "Lila celestial", hex: "#C7B8CD" },
      { nombre: "Rosa boreal", hex: "#D2A2B2" },
      { nombre: "Crema lunar", hex: "#F4EEE5" },
    ],
    grabado: PALETA_AURORA_DIURNA,
  },
];

export const TIPO_LABEL: Record<TipoPieza, string> = {
  conjunto: "Conjunto",
  body: "Body",
  complemento: "Complemento",
};

const TALLAS: Talla[] = ["XS", "S", "M", "L", "XL"];

const LINEA_PRODUCTS: LineaProduct[] = [
  {
    slug: "brume",
    nombre: "Brume",
    linea: "diario",
    precio: 69000,
    resumen: "Panty de tiro medio en microfibra mate con panel de encaje en la cadera.",
    descripcion:
      "Microfibra mate de acabado invisible bajo cualquier tela, con un panel de encaje que recorre la cadera. Bordes láser: sin costuras, sin marca, sin tener que acomodarla durante el día.",
    materiales: ["Microfibra 88%, elastano 12%", "Panel de encaje en cadera", "Bordes con corte láser"],
    cuidado: "Lavado a mano en agua fría. Secar a la sombra.",
    tallas: TALLAS,
  },
  {
    slug: "solene",
    nombre: "Solène",
    linea: "ritual",
    precio: 169000,
    resumen: "Bralette de encaje floral con herrajes en rose gold y tirantes que se cruzan.",
    descripcion:
      "Encaje floral de doble capa en la copa, tirantes ajustables que se cruzan en la espalda y herrajes en rose gold pulido. Pensada para verse tanto como para sentirse: funciona sola bajo un blazer abierto.",
    materiales: ["Encaje floral de doble capa", "Tul elástico en espalda", "Argollas y reguladores en rose gold pulido"],
    cuidado: "Lavado a mano en agua fría, sin detergente enzimático. Secar en plano.",
    tallas: TALLAS,
  },
  {
    slug: "nuit-douce",
    nombre: "Nuit Douce",
    linea: "ritual",
    precio: 239000,
    resumen: "Conjunto de brasier y tanga en tul bordado.",
    descripcion:
      "Brasier de varilla delgada con copa en tul bordado y tanga de tiro alto en el mismo tejido. El bordado se trabaja como continuación entre las dos piezas: el motivo empieza en la copa y termina en la cadera.",
    materiales: ["Tul bordado", "Varilla delgada forrada", "Broche de tres posiciones en rose gold"],
    cuidado: "Lavado a mano en agua fría. No usar secadora ni blanqueador.",
    tallas: TALLAS,
  },
  {
    slug: "cle-de-soie",
    nombre: "Clé de Soie",
    linea: "velada",
    precio: 329000,
    resumen: "Body de encaje con transparencias graduales y herraje grabado.",
    descripcion:
      "La pieza que le da nombre a la llave. Encaje que va de opaco a transparente a medida que sube, escote profundo sostenido por tirantes finos, y broche inferior con la llave Versé grabada en el herraje.",
    materiales: ["Encaje de transparencia gradual", "Forro de tul en el frente", "Broche inferior con herraje grabado"],
    cuidado: "Lavado a mano en agua fría, por separado. Secar en plano, a la sombra.",
    tallas: TALLAS,
  },
  {
    slug: "verso",
    nombre: "Verso",
    linea: "velada",
    precio: 289000,
    resumen: "Kimono corto en gasa con ribete de encaje y cinturón del mismo tejido.",
    descripcion:
      "Gasa de caída fluida, manga tres cuartos y ribete de encaje en el borde delantero. Se usa sobre cualquier pieza de la colección; es lo que queda puesto cuando ya no hay a dónde ir.",
    materiales: ["Gasa de viscosa", "Ribete de encaje en borde y puños", "Cinturón del mismo tejido"],
    cuidado: "Lavado a mano en agua fría. Planchar a baja temperatura del revés.",
    tallas: ["Única"],
  },
];

/**
 * Aurora — colección aparte de las tres líneas de arriba, con su propia
 * identidad (ver /app/aurora). Veinte piezas: diez por tonalidad, y dentro
 * de cada tonalidad cuatro conjuntos, tres bodies y tres complementos.
 *
 * Todavía no hay copy, precio ni ficha de materiales reales para ninguna de
 * estas veinte piezas — solo nombre, tipo y tonalidad son ciertos. Los
 * conjuntos sí traen `piezas` (3 o 4, según si incluyen liguero u otro
 * complemento) porque eso lo confirmó la marca; el resto se deja vacío a
 * propósito en vez de inventarlo. Además, cada pieza de un conjunto podrá
 * comprarse por separado más adelante — este catálogo todavía no lo modela
 * (ver memoria del proyecto), así que por ahora el conjunto vive como una
 * sola entrada.
 */
const AURORA_PRODUCTS: AuroraProduct[] = [
  // ---------- Nocturna ----------
  { slug: "aurora-eclipse", nombre: "Eclipse", coleccion: "aurora", tonalidad: "nocturna", tipo: "conjunto", piezas: 4, tallas: TALLAS },
  { slug: "aurora-abismo", nombre: "Abismo", coleccion: "aurora", tonalidad: "nocturna", tipo: "conjunto", piezas: 4, tallas: TALLAS },
  { slug: "aurora-pulsar", nombre: "Pulsar", coleccion: "aurora", tonalidad: "nocturna", tipo: "conjunto", piezas: 3, tallas: TALLAS },
  { slug: "aurora-nebula", nombre: "Nébula", coleccion: "aurora", tonalidad: "nocturna", tipo: "conjunto", piezas: 3, tallas: TALLAS },
  { slug: "aurora-medianoche", nombre: "Medianoche", coleccion: "aurora", tonalidad: "nocturna", tipo: "body", tallas: TALLAS },
  { slug: "aurora-umbra", nombre: "Umbra", coleccion: "aurora", tonalidad: "nocturna", tipo: "body", tallas: TALLAS },
  { slug: "aurora-onix", nombre: "Ónix", coleccion: "aurora", tonalidad: "nocturna", tipo: "body", tallas: TALLAS },
  { slug: "aurora-penumbra", nombre: "Penumbra", coleccion: "aurora", tonalidad: "nocturna", tipo: "complemento", tallas: ["Única"] },
  { slug: "aurora-grafito", nombre: "Grafito", coleccion: "aurora", tonalidad: "nocturna", tipo: "complemento", tallas: ["Única"] },
  { slug: "aurora-solsticio", nombre: "Solsticio", coleccion: "aurora", tonalidad: "nocturna", tipo: "complemento", tallas: ["Única"] },

  // ---------- Diurna ----------
  { slug: "aurora-alba", nombre: "Alba", coleccion: "aurora", tonalidad: "diurna", tipo: "conjunto", piezas: 4, tallas: TALLAS },
  { slug: "aurora-escarcha", nombre: "Escarcha", coleccion: "aurora", tonalidad: "diurna", tipo: "conjunto", piezas: 3, tallas: TALLAS },
  { slug: "aurora-celestial", nombre: "Celestial", coleccion: "aurora", tonalidad: "diurna", tipo: "conjunto", piezas: 4, tallas: TALLAS },
  { slug: "aurora-rocio", nombre: "Rocío", coleccion: "aurora", tonalidad: "diurna", tipo: "conjunto", piezas: 3, tallas: TALLAS },
  { slug: "aurora-niebla", nombre: "Niebla", coleccion: "aurora", tonalidad: "diurna", tipo: "body", tallas: TALLAS },
  { slug: "aurora-lunar", nombre: "Lunar", coleccion: "aurora", tonalidad: "diurna", tipo: "body", tallas: TALLAS },
  { slug: "aurora-cristal", nombre: "Cristal", coleccion: "aurora", tonalidad: "diurna", tipo: "body", tallas: TALLAS },
  { slug: "aurora-perla", nombre: "Perla", coleccion: "aurora", tonalidad: "diurna", tipo: "complemento", tallas: ["Única"] },
  { slug: "aurora-vapor", nombre: "Vapor", coleccion: "aurora", tonalidad: "diurna", tipo: "complemento", tallas: ["Única"] },
  { slug: "aurora-marfil", nombre: "Marfil", coleccion: "aurora", tonalidad: "diurna", tipo: "complemento", tallas: ["Única"] },
];

export const PRODUCTS: Product[] = [...LINEA_PRODUCTS, ...AURORA_PRODUCTS];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function productsByLinea(linea: Linea): Product[] {
  return PRODUCTS.filter((p): p is LineaProduct => !esAurora(p) && p.linea === linea);
}

export function getLinea(id: Linea): LineaInfo {
  const linea = LINEAS.find((l) => l.id === id);
  if (!linea) throw new Error(`Línea desconocida: ${id}`);
  return linea;
}

export function auroraPorTonalidad(tonalidad: Tonalidad): AuroraProduct[] {
  return PRODUCTS.filter((p): p is AuroraProduct => esAurora(p) && p.tonalidad === tonalidad);
}

export function getTonalidad(id: Tonalidad): TonalidadInfo {
  const t = TONALIDADES.find((t) => t.id === id);
  if (!t) throw new Error(`Tonalidad desconocida: ${id}`);
  return t;
}
