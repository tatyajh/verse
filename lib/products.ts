/**
 * Catálogo — fuente única de verdad.
 *
 * Precios y nombres son marcador de posición hasta que Versé confirme la
 * primera producción. Para cambiarlos no hay que tocar ningún componente.
 *
 * El servidor SIEMPRE recalcula totales desde aquí: nada de lo que llegue
 * del navegador decide cuánto se cobra.
 */

export type Linea = "diario" | "ritual" | "velada";

export type Talla = "XS" | "S" | "M" | "L" | "XL" | "Única";

export type Product = {
  slug: string;
  nombre: string;
  linea: Linea;
  /** Pesos colombianos, sin decimales. */
  precio: number;
  resumen: string;
  descripcion: string;
  materiales: string[];
  cuidado: string;
  tallas: Talla[];
  /** Ruta a fotografía real. Mientras no exista, se dibuja el grabado de encaje. */
  image?: string;
};

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

const TALLAS: Talla[] = ["XS", "S", "M", "L", "XL"];

export const PRODUCTS: Product[] = [
  {
    slug: "aurora",
    nombre: "Aurora",
    linea: "diario",
    precio: 129000,
    resumen: "Bralette sin aro en algodón peinado con ribete de encaje francés.",
    descripcion:
      "La pieza que te pones sin pensarlo. Copa suave sin varilla ni relleno, banda elástica ancha que sostiene sin marcar, y un ribete de encaje francés en el escote que aparece solo cuando la camisa se abre un botón.",
    materiales: ["Algodón peinado 92%, elastano 8%", "Encaje francés en escote y espalda", "Reguladores en rose gold mate"],
    cuidado: "Lavado a mano en agua fría. Secar a la sombra, sin retorcer.",
    tallas: TALLAS,
  },
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

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function productsByLinea(linea: Linea): Product[] {
  return PRODUCTS.filter((p) => p.linea === linea);
}

export function getLinea(id: Linea): LineaInfo {
  const linea = LINEAS.find((l) => l.id === id);
  if (!linea) throw new Error(`Línea desconocida: ${id}`);
  return linea;
}
