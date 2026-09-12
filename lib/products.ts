import { PALETA_AURORA_DIURNA, PALETA_AURORA_NOCTURNA, type PaletaGrabado } from "@/components/lace-canvas";

/**
 * Catálogo — fuente única de verdad.
 *
 * Todo el catálogo es, por ahora, la colección Aurora: dos tonalidades
 * (nocturna/diurna) cruzadas con el tipo de pieza (conjunto/body/complemento).
 * Antes existió un catálogo de muestra en tres "líneas" inventadas
 * (Diario/Ritual/Velada) para tener algo que mostrar mientras se definía la
 * marca; se retiró porque no correspondía a ninguna decisión real de Versé.
 *
 * El servidor SIEMPRE recalcula totales desde aquí: nada de lo que llegue
 * del navegador decide cuánto se cobra.
 */

export type Talla = "XS" | "S" | "M" | "L" | "XL" | "Única";
export type Tonalidad = "nocturna" | "diurna";
export type TipoPieza = "conjunto" | "body" | "complemento";

export type Product = {
  slug: string;
  nombre: string;
  tonalidad: Tonalidad;
  tipo: TipoPieza;
  /**
   * Solo en conjuntos: cuántas piezas trae (3 o 4, según si incluye liguero
   * u otro complemento). Es la única certeza que hay todavía sobre el
   * contenido del set — no se inventa cuáles son esas piezas.
   */
  piezas?: number;
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

/**
 * Veinte piezas: diez por tonalidad, y dentro de cada tonalidad cuatro
 * conjuntos, tres bodies y tres complementos.
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
export const PRODUCTS: Product[] = [
  // ---------- Nocturna ----------
  { slug: "aurora-eclipse", nombre: "Eclipse", tonalidad: "nocturna", tipo: "conjunto", piezas: 4, tallas: TALLAS },
  { slug: "aurora-abismo", nombre: "Abismo", tonalidad: "nocturna", tipo: "conjunto", piezas: 4, tallas: TALLAS },
  { slug: "aurora-pulsar", nombre: "Pulsar", tonalidad: "nocturna", tipo: "conjunto", piezas: 3, tallas: TALLAS },
  { slug: "aurora-nebula", nombre: "Nébula", tonalidad: "nocturna", tipo: "conjunto", piezas: 3, tallas: TALLAS },
  { slug: "aurora-medianoche", nombre: "Medianoche", tonalidad: "nocturna", tipo: "body", tallas: TALLAS },
  { slug: "aurora-umbra", nombre: "Umbra", tonalidad: "nocturna", tipo: "body", tallas: TALLAS },
  { slug: "aurora-onix", nombre: "Ónix", tonalidad: "nocturna", tipo: "body", tallas: TALLAS },
  { slug: "aurora-penumbra", nombre: "Penumbra", tonalidad: "nocturna", tipo: "complemento", tallas: ["Única"] },
  { slug: "aurora-grafito", nombre: "Grafito", tonalidad: "nocturna", tipo: "complemento", tallas: ["Única"] },
  { slug: "aurora-solsticio", nombre: "Solsticio", tonalidad: "nocturna", tipo: "complemento", tallas: ["Única"] },

  // ---------- Diurna ----------
  { slug: "aurora-alba", nombre: "Alba", tonalidad: "diurna", tipo: "conjunto", piezas: 4, tallas: TALLAS },
  { slug: "aurora-escarcha", nombre: "Escarcha", tonalidad: "diurna", tipo: "conjunto", piezas: 3, tallas: TALLAS },
  { slug: "aurora-celestial", nombre: "Celestial", tonalidad: "diurna", tipo: "conjunto", piezas: 4, tallas: TALLAS },
  { slug: "aurora-rocio", nombre: "Rocío", tonalidad: "diurna", tipo: "conjunto", piezas: 3, tallas: TALLAS },
  { slug: "aurora-niebla", nombre: "Niebla", tonalidad: "diurna", tipo: "body", tallas: TALLAS },
  { slug: "aurora-lunar", nombre: "Lunar", tonalidad: "diurna", tipo: "body", tallas: TALLAS },
  { slug: "aurora-cristal", nombre: "Cristal", tonalidad: "diurna", tipo: "body", tallas: TALLAS },
  { slug: "aurora-perla", nombre: "Perla", tonalidad: "diurna", tipo: "complemento", tallas: ["Única"] },
  { slug: "aurora-vapor", nombre: "Vapor", tonalidad: "diurna", tipo: "complemento", tallas: ["Única"] },
  { slug: "aurora-marfil", nombre: "Marfil", tonalidad: "diurna", tipo: "complemento", tallas: ["Única"] },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function porTonalidad(tonalidad: Tonalidad): Product[] {
  return PRODUCTS.filter((p) => p.tonalidad === tonalidad);
}

export function getTonalidad(id: Tonalidad): TonalidadInfo {
  const t = TONALIDADES.find((t) => t.id === id);
  if (!t) throw new Error(`Tonalidad desconocida: ${id}`);
  return t;
}
