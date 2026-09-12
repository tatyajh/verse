const COP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

/**
 * "$ 129.000" — el separador entre signo y cifra se fuerza a espacio duro
 * para que el "$" nunca quede colgando al final de una línea.
 *
 * Sin precio todavía (piezas de Aurora sin confirmar) devuelve la misma
 * palabra que usa el resto del sitio para lo que aún no está definido.
 */
export function formatCOP(pesos: number | undefined): string {
  if (pesos === undefined) return "Por confirmar";
  return COP.format(pesos).replace(/\s/g, " ");
}

/** Wompi cobra en centavos. */
export function toCents(pesos: number): number {
  return Math.round(pesos * 100);
}
