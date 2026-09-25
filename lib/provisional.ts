import type { Product, Tonalidad } from "./products";

/**
 * Fotos y precios PROVISIONALES para ver el sitio completo antes del
 * lanzamiento. Nada de esto es de Versé.
 *
 * - Fotos: Unsplash (licencia Unsplash: uso comercial libre, sin atribución
 *   obligatoria). Se sirven desde su CDN; no están en el repo. Las fotos con
 *   personas no traen autorización de modelo para una marca: no usarlas en
 *   publicidad ni en el lanzamiento.
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
  "aurora-marfil": U("photo-1745091951967-40a877a20616"),
  "aurora-penumbra": U("photo-1644945591588-dd44c3c257b0"),
  // Vigilia
  "aurora-abismo": U("photo-1669026778121-2a04f3918b60"),
  "aurora-nebula": U("photo-1770290924629-5c74da19051c"),
  "aurora-medianoche": U("photo-1779207383794-cb9a282e2db0"),
  "aurora-niebla": U("photo-1546464750-77d1763f6401"),
  "aurora-grafito": U("photo-1593250816874-8edf4f732edb"),
  // Borealis
  "aurora-alba": U("photo-1768794521439-5315a232a0e4"),
  "aurora-escarcha": U("photo-1778863663181-2ae9f04df79f"),
  "aurora-lunar": U("photo-1778863663049-5540aa1da253"),
  "aurora-cristal": U("photo-1648226313182-d73107e609ec"),
  "aurora-perla": U("photo-1676696706907-0e04665b80bd"),
  // Prima Luce
  "aurora-celestial": U("photo-1620900128850-b12749d73093"),
  "aurora-rocio": U("photo-1660070607601-f7d0234665c4"),
  "aurora-umbra": U("photo-1709422709754-1dafd324f30b"),
  "aurora-onix": U("photo-1651671685354-8ef9110ea28e"),
  "aurora-vapor": U("photo-1617055407123-3d7130c1f940"),
};

/** Las prendas sueltas de cada conjunto se muestran como muestras de tela. */
const TEXTURAS: Record<Tonalidad, string[]> = {
  noctis: [U("photo-1705674337411-3b89e5afcc11"), U("photo-1742492115505-c8b009107f1d")],
  vigilia: [U("photo-1612744192242-35cd7a7d35e6"), U("photo-1696021922015-f9916330aa8d")],
  borealis: [U("photo-1634225234360-7c921a9d2400"), U("photo-1594734415578-00fc9540929b")],
  "prima-luce": [
    U("photo-1769420290265-6359445daaa4"),
    U("photo-1769420295409-ce777445e57b"),
    U("photo-1732869415090-179de017b6d6"),
  ],
};

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
