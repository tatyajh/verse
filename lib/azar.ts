/**
 * Azar determinista: la misma semilla dibuja siempre lo mismo.
 *
 * Vive aparte porque lo comparten el grabado de las piezas
 * (components/lace-canvas.tsx) y las cintas de la aurora
 * (lib/cielo.ts). Una sola mano para todo lo generativo del sitio.
 */

export function semilla(texto: string): number {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32: pequeño, determinista y suficiente para dibujo. */
export function prng(estado: number): () => number {
  let a = estado;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
