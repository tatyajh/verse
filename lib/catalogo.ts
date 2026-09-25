import { getProduct, type Product, type TipoPieza } from "./products";

/** Tipos por los que se puede filtrar, en el orden en que se muestran. */
export const TIPOS_FILTRO: TipoPieza[] = [
  "conjunto",
  "body",
  "corset",
  "bra",
  "panty",
  "tanga",
  "liguero",
  "complemento",
];

export function esTipoPieza(valor: string | undefined): valor is TipoPieza {
  return TIPOS_FILTRO.includes(valor as TipoPieza);
}

/**
 * Agrupa piezas por tipo. Sin filtro se muestran solo las principales
 * (conjuntos, bodies, complementos); las prendas sueltas aparecen bajo su
 * conjunto o al filtrar por su tipo.
 */
export function agruparPorTipo(
  piezas: Product[],
  filtro: TipoPieza | null,
): { tipo: TipoPieza; productos: Product[] }[] {
  const tipos: TipoPieza[] = filtro ? [filtro] : ["conjunto", "body", "complemento"];
  return tipos
    .map((tipo) => ({ tipo, productos: piezas.filter((p) => p.tipo === tipo) }))
    .filter((g) => g.productos.length > 0);
}

/**
 * Galería de un conjunto: el conjunto primero y después cada prenda que se
 * vende suelta. Una pieza que no es conjunto tiene galería de un solo cuadro.
 */
export function galeriaDe(producto: Product): Product[] {
  const prendas = (producto.componentes ?? [])
    .map((slug) => getProduct(slug))
    .filter((p): p is Product => p !== undefined);
  return [producto, ...prendas];
}
