import type { Product, Tonalidad } from "./products";
import type { ColeccionId } from "./colecciones";

/**
 * Fotos y precios PROVISIONALES para ver el sitio completo antes del
 * lanzamiento. Nada de esto es de Versé.
 *
 * - Fotos: Unsplash (licencia Unsplash: uso comercial libre, sin atribución
 *   obligatoria). Se sirven desde su CDN; no están en el repo. Las fotos con
 *   personas no traen autorización de modelo para una marca: no usarlas en
 *   publicidad ni en el lanzamiento.
 * - Bodegones en public/provisional/: generados con DALL·E por la marca como
 *   referencia de ambiente. No son piezas reales: no usarlos como foto de
 *   producto en el lanzamiento.
 * - Precios: 0, solo para recorrer el flujo de compra. /api/checkout rechaza
 *   cualquier pieza en 0, así que nunca llegan a un cobro.
 *
 * Para quitarlo todo: ACTIVO = false. Una pieza con `image` o `precio` propio
 * en products.ts siempre gana sobre esto.
 */
export const ACTIVO = true;

const U = (id: string) => `https://images.unsplash.com/${id}`;

/** Una foto por pieza principal. La clave es el slug. */
const FOTOS: Record<string, string> = {
  // Noctis
  "aurora-eclipse": U("photo-1778436196655-eb8507c86a26"),
  "aurora-pulsar": U("photo-1778437570740-315daa8dccf9"),
  "aurora-solsticio": U("photo-1772087700114-dc342769e246"),
  "aurora-marfil": U("photo-1618437542145-38e9015cf8f1"),
  "aurora-penumbra": U("photo-1644945591588-dd44c3c257b0"),
  // Vigilia
  "aurora-abismo": U("photo-1669026778121-2a04f3918b60"),
  "aurora-nebula": U("photo-1770290924629-5c74da19051c"),
  "aurora-medianoche": U("photo-1779207383794-cb9a282e2db0"),
  "aurora-niebla": U("photo-1546464750-77d1763f6401"),
  "aurora-grafito": U("photo-1593250816874-8edf4f732edb"),
  // Borealis
  "aurora-alba": U("photo-1768794521439-5315a232a0e4"),
  "aurora-escarcha": "/provisional/borealis-conjunto.jpg",
  "aurora-lunar": U("photo-1778863663049-5540aa1da253"),
  "aurora-cristal": U("photo-1627052045672-be78a58fcd37"),
  "aurora-perla": U("photo-1676696706907-0e04665b80bd"),
  // Prima Luce
  "aurora-celestial": U("photo-1631737860377-2d332ca3e3f5"),
  "aurora-rocio": "/provisional/prima-luce-conjunto.jpg",
  "aurora-umbra": U("photo-1709422709754-1dafd324f30b"),
  "aurora-onix": U("photo-1594734415578-00fc9540929b"),
  "aurora-vapor": U("photo-1617055407123-3d7130c1f940"),
};

/** Las prendas sueltas de cada conjunto se muestran como muestras de seda lisa (sin encaje floral). */
const TEXTURAS: Record<Tonalidad, string[]> = {
  noctis: [U("photo-1705674337411-3b89e5afcc11"), U("photo-1720591279641-d940b9009ae0")],
  vigilia: [U("photo-1612744192242-35cd7a7d35e6"), U("photo-1617238749996-ab4c0f9fba57")],
  borealis: [U("photo-1527167598984-8802d8028eea"), U("photo-1676696706907-0e04665b80bd")],
  "prima-luce": [U("photo-1617055407123-3d7130c1f940"), U("photo-1631737860377-2d332ca3e3f5")],
};

/** Imagen de cada colección, en su sección de la portada. */
export const IMAGEN_COLECCION: Partial<Record<ColeccionId, string>> = ACTIVO
  ? { aurora: "/provisional/aurora-trio.jpg" }
  : {};

/** Foto del hero: detrás del encaje de la llave. */
export const FOTO_PORTADA = ACTIVO ? U("photo-1768794521439-5315a232a0e4") : undefined;

export function conProvisional(p: Product, indice: number): Product {
  if (!ACTIVO) return p;
  const texturas = TEXTURAS[p.tonalidad];
  return {
    ...p,
    image: p.image ?? FOTOS[p.slug] ?? texturas[indice % texturas.length],
    precio: p.precio ?? 0,
  };
}
