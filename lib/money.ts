const COP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

/**
 * "$ 129.000" — el separador entre signo y cifra se fuerza a espacio duro
 * para que el "$" nunca quede colgando al final de una línea.
 */
export function formatCOP(pesos: number): string {
  return COP.format(pesos).replace(/\s/g, "\u00A0");
}

/** Wompi cobra en centavos. */
export function toCents(pesos: number): number {
  return Math.round(pesos * 100);
}
