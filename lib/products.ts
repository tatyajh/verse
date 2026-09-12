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
export type TipoPieza = "conjunto" | "body" | "complemento" | "bra" | "panty" | "tanga" | "liguero" | "brasiera" | "longline" | "manto";

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
  /**
   * Array de slugs de prendas individuales que componen este conjunto.
   * Solo presente en productos tipo "conjunto".
   */
  componentes?: string[];
  /**
   * Slug del conjunto padre si esta prenda es componente de un conjunto.
   * Presente en prendas tipo "bra", "panty", "tanga", "liguero", etc.
   */
  componenteDe?: string;
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
  bra: "Bra",
  panty: "Panty",
  tanga: "Tanga",
  liguero: "Liguero",
  brasiera: "Brasiera",
  longline: "Longline",
  manto: "Manto",
};

const TALLAS: Talla[] = ["XS", "S", "M", "L", "XL"];

/**
 * Catálogo completo: Veinte piezas (conjuntos, bodies, complementos) más sus
 * componentes individuales. Los conjuntos ahora traen un array de slugs de sus
 * componentes, permitiendo compras individual de bras, panties, tangas, etc.
 */
export const PRODUCTS: Product[] = [
  // ---------- Nocturna Conjuntos ----------
  {
    slug: "aurora-eclipse",
    nombre: "Sombra",
    tonalidad: "nocturna",
    tipo: "conjunto",
    piezas: 4,
    tallas: TALLAS,
    componentes: ["aurora-eclipse-bra", "aurora-eclipse-panty", "aurora-eclipse-tanga", "aurora-eclipse-brasiera"],
  },
  {
    slug: "aurora-abismo",
    nombre: "Abismo",
    tonalidad: "nocturna",
    tipo: "conjunto",
    piezas: 4,
    tallas: TALLAS,
    componentes: ["aurora-abismo-longline", "aurora-abismo-panty", "aurora-abismo-tanga", "aurora-abismo-liguero"],
  },
  {
    slug: "aurora-pulsar",
    nombre: "Equinoccio",
    tonalidad: "nocturna",
    tipo: "conjunto",
    piezas: 3,
    tallas: TALLAS,
    componentes: ["aurora-pulsar-bra", "aurora-pulsar-panty", "aurora-pulsar-tanga"],
  },
  {
    slug: "aurora-nebula",
    nombre: "Nébula",
    tonalidad: "nocturna",
    tipo: "conjunto",
    piezas: 3,
    tallas: TALLAS,
    componentes: ["aurora-nebula-bra", "aurora-nebula-panty", "aurora-nebula-tanga"],
  },

  // ---------- Nocturna Conjuntos - Componentes Individuales ----------
  // Eclipse
  { slug: "aurora-eclipse-bra", nombre: "Bra Intensa", tonalidad: "nocturna", tipo: "bra", tallas: TALLAS, componenteDe: "aurora-eclipse" },
  { slug: "aurora-eclipse-panty", nombre: "Panty Clásico", tonalidad: "nocturna", tipo: "panty", tallas: TALLAS, componenteDe: "aurora-eclipse" },
  { slug: "aurora-eclipse-tanga", nombre: "Tanga", tonalidad: "nocturna", tipo: "tanga", tallas: TALLAS, componenteDe: "aurora-eclipse" },
  { slug: "aurora-eclipse-brasiera", nombre: "Brasiera", tonalidad: "nocturna", tipo: "brasiera", tallas: TALLAS, componenteDe: "aurora-eclipse" },

  // Abismo
  { slug: "aurora-abismo-longline", nombre: "Longline Magnética", tonalidad: "nocturna", tipo: "longline", tallas: TALLAS, componenteDe: "aurora-abismo" },
  { slug: "aurora-abismo-panty", nombre: "Panty Tiro Medio", tonalidad: "nocturna", tipo: "panty", tallas: TALLAS, componenteDe: "aurora-abismo" },
  { slug: "aurora-abismo-tanga", nombre: "Tanga", tonalidad: "nocturna", tipo: "tanga", tallas: TALLAS, componenteDe: "aurora-abismo" },
  { slug: "aurora-abismo-liguero", nombre: "Liguero Ajustable", tonalidad: "nocturna", tipo: "liguero", tallas: ["Única"], componenteDe: "aurora-abismo" },

  // Pulsar
  { slug: "aurora-pulsar-bra", nombre: "Bra Romántica", tonalidad: "nocturna", tipo: "bra", tallas: TALLAS, componenteDe: "aurora-pulsar" },
  { slug: "aurora-pulsar-panty", nombre: "Panty Clásico", tonalidad: "nocturna", tipo: "panty", tallas: TALLAS, componenteDe: "aurora-pulsar" },
  { slug: "aurora-pulsar-tanga", nombre: "Tanga con Tirales", tonalidad: "nocturna", tipo: "tanga", tallas: TALLAS, componenteDe: "aurora-pulsar" },

  // Nébula
  { slug: "aurora-nebula-bra", nombre: "Bralette Halter", tonalidad: "nocturna", tipo: "bra", tallas: TALLAS, componenteDe: "aurora-nebula" },
  { slug: "aurora-nebula-panty", nombre: "Panty Clásico", tonalidad: "nocturna", tipo: "panty", tallas: TALLAS, componenteDe: "aurora-nebula" },
  { slug: "aurora-nebula-tanga", nombre: "Tanga con Tirales", tonalidad: "nocturna", tipo: "tanga", tallas: TALLAS, componenteDe: "aurora-nebula" },

  // ---------- Nocturna Bodies y Complementos ----------
  { slug: "aurora-medianoche", nombre: "Medianoche", tonalidad: "nocturna", tipo: "body", tallas: TALLAS },
  { slug: "aurora-umbra", nombre: "Umbra", tonalidad: "nocturna", tipo: "body", tallas: TALLAS },
  { slug: "aurora-onix", nombre: "Ónix", tonalidad: "nocturna", tipo: "body", tallas: TALLAS },
  { slug: "aurora-penumbra", nombre: "Penumbra", tonalidad: "nocturna", tipo: "complemento", tallas: ["Única"] },
  { slug: "aurora-grafito", nombre: "Grafito", tonalidad: "nocturna", tipo: "complemento", tallas: ["Única"] },
  { slug: "aurora-solsticio", nombre: "Solsticio", tonalidad: "nocturna", tipo: "complemento", tallas: ["Única"] },

  // ---------- Diurna Conjuntos ----------
  {
    slug: "aurora-alba",
    nombre: "Alba",
    tonalidad: "diurna",
    tipo: "conjunto",
    piezas: 4,
    tallas: TALLAS,
    componentes: ["aurora-alba-bra", "aurora-alba-panty", "aurora-alba-tanga", "aurora-alba-liguero"],
  },
  {
    slug: "aurora-escarcha",
    nombre: "Escarcha",
    tonalidad: "diurna",
    tipo: "conjunto",
    piezas: 3,
    tallas: TALLAS,
    componentes: ["aurora-escarcha-bra", "aurora-escarcha-panty", "aurora-escarcha-tanga"],
  },
  {
    slug: "aurora-celestial",
    nombre: "Celestial",
    tonalidad: "diurna",
    tipo: "conjunto",
    piezas: 4,
    tallas: TALLAS,
    componentes: ["aurora-celestial-bra", "aurora-celestial-panty", "aurora-celestial-tanga", "aurora-celestial-liguero"],
  },
  {
    slug: "aurora-rocio",
    nombre: "Rocío",
    tonalidad: "diurna",
    tipo: "conjunto",
    piezas: 3,
    tallas: TALLAS,
    componentes: ["aurora-rocio-bra", "aurora-rocio-panty", "aurora-rocio-tanga"],
  },

  // ---------- Diurna Conjuntos - Componentes Individuales ----------
  // Alba
  { slug: "aurora-alba-bra", nombre: "Bra", tonalidad: "diurna", tipo: "bra", tallas: TALLAS, componenteDe: "aurora-alba" },
  { slug: "aurora-alba-panty", nombre: "Panty Clásico", tonalidad: "diurna", tipo: "panty", tallas: TALLAS, componenteDe: "aurora-alba" },
  { slug: "aurora-alba-tanga", nombre: "Tanga", tonalidad: "diurna", tipo: "tanga", tallas: TALLAS, componenteDe: "aurora-alba" },
  { slug: "aurora-alba-liguero", nombre: "Liguero", tonalidad: "diurna", tipo: "liguero", tallas: ["Única"], componenteDe: "aurora-alba" },

  // Escarcha
  { slug: "aurora-escarcha-bra", nombre: "Bra", tonalidad: "diurna", tipo: "bra", tallas: TALLAS, componenteDe: "aurora-escarcha" },
  { slug: "aurora-escarcha-panty", nombre: "Panty Clásico", tonalidad: "diurna", tipo: "panty", tallas: TALLAS, componenteDe: "aurora-escarcha" },
  { slug: "aurora-escarcha-tanga", nombre: "Tanga", tonalidad: "diurna", tipo: "tanga", tallas: TALLAS, componenteDe: "aurora-escarcha" },

  // Celestial
  { slug: "aurora-celestial-bra", nombre: "Bra", tonalidad: "diurna", tipo: "bra", tallas: TALLAS, componenteDe: "aurora-celestial" },
  { slug: "aurora-celestial-panty", nombre: "Panty Clásico", tonalidad: "diurna", tipo: "panty", tallas: TALLAS, componenteDe: "aurora-celestial" },
  { slug: "aurora-celestial-tanga", nombre: "Tanga", tonalidad: "diurna", tipo: "tanga", tallas: TALLAS, componenteDe: "aurora-celestial" },
  { slug: "aurora-celestial-liguero", nombre: "Liguero", tonalidad: "diurna", tipo: "liguero", tallas: ["Única"], componenteDe: "aurora-celestial" },

  // Rocío
  { slug: "aurora-rocio-bra", nombre: "Bra", tonalidad: "diurna", tipo: "bra", tallas: TALLAS, componenteDe: "aurora-rocio" },
  { slug: "aurora-rocio-panty", nombre: "Panty Clásico", tonalidad: "diurna", tipo: "panty", tallas: TALLAS, componenteDe: "aurora-rocio" },
  { slug: "aurora-rocio-tanga", nombre: "Tanga", tonalidad: "diurna", tipo: "tanga", tallas: TALLAS, componenteDe: "aurora-rocio" },

  // ---------- Diurna Bodies y Complementos ----------
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
