import { PALETA_AURORA_DIURNA, PALETA_AURORA_NOCTURNA, type PaletaGrabado } from "@/components/lace-canvas";

/**
 * Catálogo Aurora — 4 momentos, 20 piezas.
 * Distribución: Noctis (5) + Vigilia (5) + Borealis (5) + Prima Luce (5)
 *
 * El servidor SIEMPRE recalcula totales desde aquí: nada de lo que llegue
 * del navegador decide cuánto se cobra.
 */

export type Talla = "S" | "M" | "L" | "XL" | "Única";
export type Tonalidad = "noctis" | "vigilia" | "borealis" | "prima-luce";
export type TipoPieza = "conjunto" | "body" | "corset" | "complemento" | "bra" | "panty" | "tanga" | "liguero" | "brasiera" | "longline" | "manto";

export type Product = {
  slug: string;
  nombre: string;
  tonalidad: Tonalidad;
  tipo: TipoPieza;
  piezas?: number;
  precio?: number;
  resumen?: string;
  descripcion?: string;
  materiales?: string[];
  cuidado?: string;
  tallas: Talla[];
  image?: string;
  giro?: string[];
  componentes?: string[];
  componenteDe?: string;
};

export type TonalidadInfo = {
  id: Tonalidad;
  nombre: string;
  sensacion: string;
  paleta: { nombre: string; hex: string }[];
  grabado: PaletaGrabado;
};

export const TONALIDADES: TonalidadInfo[] = [
  {
    id: "noctis",
    nombre: "Noctis",
    sensacion: "Profundidad, misterio, poder",
    paleta: [
      { nombre: "Negro profundo", hex: "#0a0a0a" },
      { nombre: "Dorado", hex: "#d4af37" },
    ],
    grabado: PALETA_AURORA_NOCTURNA,
  },
  {
    id: "vigilia",
    nombre: "Vigilia",
    sensacion: "Transición, misterio azul",
    paleta: [
      { nombre: "Azul oscuro", hex: "#111A35" },
      { nombre: "Azul tinta", hex: "#20284A" },
      { nombre: "Índigo", hex: "#35345F" },
      { nombre: "Magenta oscuro", hex: "#7B2D5F" },
    ],
    grabado: PALETA_AURORA_NOCTURNA,
  },
  {
    id: "borealis",
    nombre: "Borealis",
    sensacion: "Primera luz, frescura, renacimiento",
    paleta: [
      { nombre: "Verde jade", hex: "#0F6E56" },
      { nombre: "Lila", hex: "#8E82B7" },
      { nombre: "Lavanda", hex: "#ADA4CC" },
      { nombre: "Morado gris", hex: "#8E7DA8" },
    ],
    grabado: PALETA_AURORA_DIURNA,
  },
  {
    id: "prima-luce",
    nombre: "Prima Luce",
    sensacion: "Luz cálida, esperanza, dulzura",
    paleta: [
      { nombre: "Rosado algodón", hex: "#E8B5C5" },
      { nombre: "Azul claro", hex: "#B8D2DB" },
      { nombre: "Azul hielo", hex: "#D1E3E7" },
      { nombre: "Perla", hex: "#E5E1E2" },
    ],
    grabado: PALETA_AURORA_DIURNA,
  },
];

export const TIPO_LABEL: Record<TipoPieza, string> = {
  conjunto: "Conjunto",
  body: "Body",
  corset: "Corset",
  complemento: "Complemento",
  bra: "Bra",
  panty: "Panty",
  tanga: "Tanga",
  liguero: "Liguero",
  brasiera: "Brasiera",
  longline: "Longline",
  manto: "Manto",
};

const TALLAS: Talla[] = ["S", "M", "L", "XL"];

/**
 * Catálogo Aurora: 20 piezas distribuidas en 4 momentos.
 * - Noctis: Sombra, Equinoccio + Solsticio, Marfil, Vigilia (2 + 0 + 3 = 5)
 * - Vigilia: Abismo, Nébula + Noctis, Niebla + Grafito (2 + 2 + 1 = 5)
 * - Borealis: Borealis, Nube + Lunar, Cristal + Perla (2 + 2 + 1 = 5)
 * - Prima Luce: Eclipse, Neblina + Umbra, Onix + Vapor (2 + 2 + 1 = 5)
 */
export const PRODUCTS: Product[] = [
  // ---------- MEDIANOCHE: 2 conjuntos + 3 complementos ----------
  {
    slug: "aurora-eclipse",
    nombre: "Sombra",
    tonalidad: "noctis",
    tipo: "conjunto",
    piezas: 4,
    tallas: TALLAS,
    componentes: ["aurora-eclipse-bra", "aurora-eclipse-panty", "aurora-eclipse-tanga", "aurora-eclipse-brasiera"],
  },
  {
    slug: "aurora-pulsar",
    nombre: "Equinoccio",
    tonalidad: "noctis",
    tipo: "conjunto",
    piezas: 3,
    tallas: TALLAS,
    componentes: ["aurora-pulsar-bra", "aurora-pulsar-panty", "aurora-pulsar-tanga"],
  },
  // Componentes de Noctis
  { slug: "aurora-eclipse-bra", nombre: "Bra Intensa", tonalidad: "noctis", tipo: "bra", tallas: TALLAS, componenteDe: "aurora-eclipse" },
  { slug: "aurora-eclipse-panty", nombre: "Panty Clásico", tonalidad: "noctis", tipo: "panty", tallas: TALLAS, componenteDe: "aurora-eclipse" },
  { slug: "aurora-eclipse-tanga", nombre: "Tanga", tonalidad: "noctis", tipo: "tanga", tallas: TALLAS, componenteDe: "aurora-eclipse" },
  { slug: "aurora-eclipse-brasiera", nombre: "Brasiera", tonalidad: "noctis", tipo: "brasiera", tallas: TALLAS, componenteDe: "aurora-eclipse" },
  { slug: "aurora-pulsar-bra", nombre: "Bra Romántica", tonalidad: "noctis", tipo: "bra", tallas: TALLAS, componenteDe: "aurora-pulsar" },
  { slug: "aurora-pulsar-panty", nombre: "Panty Clásico", tonalidad: "noctis", tipo: "panty", tallas: TALLAS, componenteDe: "aurora-pulsar" },
  { slug: "aurora-pulsar-tanga", nombre: "Tanga con Tirales", tonalidad: "noctis", tipo: "tanga", tallas: TALLAS, componenteDe: "aurora-pulsar" },
  // Complementos Noctis
  { slug: "aurora-solsticio", nombre: "Solsticio", tonalidad: "noctis", tipo: "complemento", tallas: ["Única"] },
  { slug: "aurora-marfil", nombre: "Marfil", tonalidad: "noctis", tipo: "complemento", tallas: ["Única"] },
  { slug: "aurora-penumbra", nombre: "Vigilia", tonalidad: "noctis", tipo: "complemento", tallas: ["Única"] },

  // ---------- PENUMBRA: 2 conjuntos + 2 bodies + 1 complemento ----------
  {
    slug: "aurora-abismo",
    nombre: "Abismo",
    tonalidad: "vigilia",
    tipo: "conjunto",
    piezas: 4,
    tallas: TALLAS,
    componentes: ["aurora-abismo-longline", "aurora-abismo-panty", "aurora-abismo-tanga", "aurora-abismo-liguero"],
  },
  {
    slug: "aurora-nebula",
    nombre: "Nébula",
    tonalidad: "vigilia",
    tipo: "conjunto",
    piezas: 3,
    tallas: TALLAS,
    componentes: ["aurora-nebula-bra", "aurora-nebula-panty", "aurora-nebula-tanga"],
  },
  // Componentes de Vigilia
  { slug: "aurora-abismo-longline", nombre: "Longline Magnética", tonalidad: "vigilia", tipo: "longline", tallas: TALLAS, componenteDe: "aurora-abismo" },
  { slug: "aurora-abismo-panty", nombre: "Panty Tiro Medio", tonalidad: "vigilia", tipo: "panty", tallas: TALLAS, componenteDe: "aurora-abismo" },
  { slug: "aurora-abismo-tanga", nombre: "Tanga", tonalidad: "vigilia", tipo: "tanga", tallas: TALLAS, componenteDe: "aurora-abismo" },
  { slug: "aurora-abismo-liguero", nombre: "Liguero Ajustable", tonalidad: "vigilia", tipo: "liguero", tallas: ["Única"], componenteDe: "aurora-abismo" },
  { slug: "aurora-nebula-bra", nombre: "Bralette Halter", tonalidad: "vigilia", tipo: "bra", tallas: TALLAS, componenteDe: "aurora-nebula" },
  { slug: "aurora-nebula-panty", nombre: "Panty Clásico", tonalidad: "vigilia", tipo: "panty", tallas: TALLAS, componenteDe: "aurora-nebula" },
  { slug: "aurora-nebula-tanga", nombre: "Tanga con Tirales", tonalidad: "vigilia", tipo: "tanga", tallas: TALLAS, componenteDe: "aurora-nebula" },
  // Bodies Vigilia
  { slug: "aurora-medianoche", nombre: "Noctis", tonalidad: "vigilia", tipo: "body", tallas: TALLAS },
  { slug: "aurora-niebla", nombre: "Niebla", tonalidad: "vigilia", tipo: "body", tallas: TALLAS },
  // Complementos Vigilia
  { slug: "aurora-grafito", nombre: "Grafito", tonalidad: "vigilia", tipo: "complemento", tallas: ["Única"] },

  // ---------- ALBA: 2 conjuntos + 2 bodies + 1 complemento ----------
  {
    slug: "aurora-alba",
    nombre: "Borealis",
    tonalidad: "borealis",
    tipo: "conjunto",
    piezas: 4,
    tallas: TALLAS,
    componentes: ["aurora-alba-bra", "aurora-alba-panty", "aurora-alba-tanga", "aurora-alba-liguero"],
  },
  {
    slug: "aurora-escarcha",
    nombre: "Nube",
    tonalidad: "borealis",
    tipo: "conjunto",
    piezas: 3,
    tallas: TALLAS,
    componentes: ["aurora-escarcha-bra", "aurora-escarcha-panty", "aurora-escarcha-tanga"],
  },
  // Componentes de Borealis
  { slug: "aurora-alba-bra", nombre: "Bra", tonalidad: "borealis", tipo: "bra", tallas: TALLAS, componenteDe: "aurora-alba" },
  { slug: "aurora-alba-panty", nombre: "Panty Clásico", tonalidad: "borealis", tipo: "panty", tallas: TALLAS, componenteDe: "aurora-alba" },
  { slug: "aurora-alba-tanga", nombre: "Tanga", tonalidad: "borealis", tipo: "tanga", tallas: TALLAS, componenteDe: "aurora-alba" },
  { slug: "aurora-alba-liguero", nombre: "Liguero", tonalidad: "borealis", tipo: "liguero", tallas: ["Única"], componenteDe: "aurora-alba" },
  { slug: "aurora-escarcha-bra", nombre: "Bra", tonalidad: "borealis", tipo: "bra", tallas: TALLAS, componenteDe: "aurora-escarcha" },
  { slug: "aurora-escarcha-panty", nombre: "Panty Clásico", tonalidad: "borealis", tipo: "panty", tallas: TALLAS, componenteDe: "aurora-escarcha" },
  { slug: "aurora-escarcha-tanga", nombre: "Tanga", tonalidad: "borealis", tipo: "tanga", tallas: TALLAS, componenteDe: "aurora-escarcha" },
  // Bodies Borealis
  { slug: "aurora-lunar", nombre: "Lunar", tonalidad: "borealis", tipo: "body", tallas: TALLAS },
  { slug: "aurora-cristal", nombre: "Cristal", tonalidad: "borealis", tipo: "body", tallas: TALLAS },
  // Complementos Borealis
  { slug: "aurora-perla", nombre: "Perla", tonalidad: "borealis", tipo: "complemento", tallas: ["Única"] },

  // ---------- AMANECER: 2 conjuntos + 2 bodies + 1 complemento ----------
  {
    slug: "aurora-celestial",
    nombre: "Eclipse",
    tonalidad: "prima-luce",
    tipo: "conjunto",
    piezas: 4,
    tallas: TALLAS,
    componentes: ["aurora-celestial-bra", "aurora-celestial-panty", "aurora-celestial-tanga", "aurora-celestial-liguero"],
  },
  {
    slug: "aurora-rocio",
    nombre: "Neblina",
    tonalidad: "prima-luce",
    tipo: "conjunto",
    piezas: 3,
    tallas: TALLAS,
    componentes: ["aurora-rocio-bra", "aurora-rocio-panty", "aurora-rocio-tanga"],
  },
  // Componentes de Prima Luce
  { slug: "aurora-celestial-bra", nombre: "Bra", tonalidad: "prima-luce", tipo: "bra", tallas: TALLAS, componenteDe: "aurora-celestial" },
  { slug: "aurora-celestial-panty", nombre: "Panty Clásico", tonalidad: "prima-luce", tipo: "panty", tallas: TALLAS, componenteDe: "aurora-celestial" },
  { slug: "aurora-celestial-tanga", nombre: "Tanga", tonalidad: "prima-luce", tipo: "tanga", tallas: TALLAS, componenteDe: "aurora-celestial" },
  { slug: "aurora-celestial-liguero", nombre: "Liguero", tonalidad: "prima-luce", tipo: "liguero", tallas: ["Única"], componenteDe: "aurora-celestial" },
  { slug: "aurora-rocio-bra", nombre: "Bra", tonalidad: "prima-luce", tipo: "bra", tallas: TALLAS, componenteDe: "aurora-rocio" },
  { slug: "aurora-rocio-panty", nombre: "Panty Clásico", tonalidad: "prima-luce", tipo: "panty", tallas: TALLAS, componenteDe: "aurora-rocio" },
  { slug: "aurora-rocio-tanga", nombre: "Tanga", tonalidad: "prima-luce", tipo: "tanga", tallas: TALLAS, componenteDe: "aurora-rocio" },
  // Bodies Prima Luce
  { slug: "aurora-umbra", nombre: "Umbra", tonalidad: "prima-luce", tipo: "body", tallas: TALLAS },
  { slug: "aurora-onix", nombre: "Ónix", tonalidad: "prima-luce", tipo: "body", tallas: TALLAS },
  // Complementos Prima Luce
  { slug: "aurora-vapor", nombre: "Vapor", tonalidad: "prima-luce", tipo: "complemento", tallas: ["Única"] },
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
