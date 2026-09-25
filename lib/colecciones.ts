/**
 * Registro de colecciones. El nav, el pie, /colecciones, el sitemap y las
 * fichas leen de aquí.
 *
 * Para agregar una colección:
 * 1. Sumarla a COLECCIONES (la primera de la lista es la vigente).
 * 2. Cargar sus piezas en lib/products.ts con ese `coleccion`.
 * 3. Crear su página en app/<id>/page.tsx. Aurora tiene página propia porque
 *    lleva su historia; una colección sin relato puede reutilizar
 *    <GrupoPiezas/> para su catálogo.
 */

export type ColeccionId = "aurora";

export type Coleccion = {
  id: ColeccionId;
  nombre: string;
  /** Una línea para la tarjeta de /colecciones. */
  descripcion: string;
  /** Página principal de la colección. */
  ruta: string;
  /** Catálogo de la colección. */
  piezas: string;
};

export const COLECCIONES: Coleccion[] = [
  {
    id: "aurora",
    nombre: "Aurora",
    descripcion: "Una noche en la nieve, contada en cuatro momentos de color.",
    ruta: "/aurora",
    piezas: "/aurora?view=productos",
  },
];

export function getColeccion(id: ColeccionId): Coleccion {
  const c = COLECCIONES.find((c) => c.id === id);
  if (!c) throw new Error(`Colección desconocida: ${id}`);
  return c;
}
