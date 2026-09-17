import { prng, semilla } from "./azar";

/**
 * El cielo de la historia: color e intensidad de la aurora en función del
 * avance del scroll.
 *
 * Todo aquí es puro —sin DOM, sin React— para poder razonarlo y probarlo
 * aparte del dibujo. El componente solo consume estos números.
 *
 * El color se interpola en OKLab, no en sRGB: el trayecto de #060608 a
 * #E8B5C5 pasa por grises sucios si se mezcla en sRGB, y el punto de toda
 * la página es que ese amanecer se vea limpio.
 */

/* ---------- color ---------- */

type Lab = [number, number, number];

const aLineal = (c: number) =>
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

const aGamma = (c: number) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

export function hexALab(hex: string): Lab {
  const n = parseInt(hex.slice(1), 16);
  const r = aLineal(((n >> 16) & 255) / 255);
  const g = aLineal(((n >> 8) & 255) / 255);
  const b = aLineal((n & 255) / 255);

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

/** Devuelve "r g b" (CSS Color 4): vale para rgb(...) y para rgb(... / alfa). */
export function labARgb([L, A, B]: Lab): string {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;

  const canal = (v: number) =>
    Math.max(0, Math.min(255, Math.round(aGamma(v) * 255)));

  return [
    canal(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    canal(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    canal(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ].join(" ");
}

const mezclaLab = (a: Lab, b: Lab, t: number): Lab => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

/* ---------- la rampa de los cuatro capítulos ---------- */

export const suave = (t: number) => t * t * (3 - 2 * t);

const acotar = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Los capítulos mandan en su centro (0.125, 0.375, 0.625, 0.875) y entre
 * centros se interpola. Antes del primero y después del último, el valor
 * se sostiene: la noche empieza cerrada y el amanecer no se pasa de largo.
 */
function tramo(p: number, n: number): { i: number; j: number; t: number } {
  const escala = acotar(p) * n - 0.5;
  const i = Math.max(0, Math.min(n - 1, Math.floor(escala)));
  const j = Math.min(n - 1, i + 1);
  return { i, j, t: suave(acotar(escala - i)) };
}

export function rampa(p: number, valores: number[]): number {
  const { i, j, t } = tramo(p, valores.length);
  return valores[i] + (valores[j] - valores[i]) * t;
}

/* ---------- las paradas del cielo ---------- */

/**
 * Cuatro paradas por capítulo, de arriba abajo. No son los swatches de la
 * paleta (esos describen la tela): son el cielo, donde el color más
 * saturado vive en el horizonte, abajo.
 */
export const CIELOS: string[][] = [
  ["#060608", "#08080c", "#0b0a10", "#141008"], // Noctis — negro, un rescoldo dorado
  ["#111A35", "#20284A", "#35345F", "#7B2D5F"], // Vigilia — azules hacia el magenta
  ["#04120e", "#0a2b22", "#123f33", "#2e2747"], // Borealis — noche de jade, la luz la ponen las cintas
  ["#B8D2DB", "#D1E3E7", "#E8B5C5", "#E5E1E2"], // Prima Luce — hielo, rosa, perla
];

const CIELOS_LAB = CIELOS.map((c) => c.map(hexALab));

/** Las cuatro paradas del gradiente del cielo en el avance p. */
export function cieloEn(p: number): string[] {
  const { i, j, t } = tramo(p, CIELOS_LAB.length);
  return CIELOS_LAB[i].map((lab, k) => labARgb(mezclaLab(lab, CIELOS_LAB[j][k], t)));
}

/* ---------- la aurora ---------- */

/** La curva dramática: la noche no tiene luz, Borealis es el incendio. */
export const INTENSIDADES = [0, 0.18, 1, 0.35];

export const intensidadEn = (p: number) => rampa(p, INTENSIDADES);

/** Núcleo y pie de las cintas por capítulo. Alba es «Verdes. Violetas.». */
const CINTAS_COLOR: [string, string][] = [
  ["#1a1410", "#d4af37"],
  ["#35345F", "#7B2D5F"],
  ["#1FB88A", "#8E82B7"],
  ["#B8D2DB", "#E8B5C5"],
];

const CINTAS_LAB = CINTAS_COLOR.map(([a, b]) => [hexALab(a), hexALab(b)] as const);

export function colorCintaEn(p: number): { nucleo: string; pie: string } {
  const { i, j, t } = tramo(p, CINTAS_LAB.length);
  return {
    nucleo: labARgb(mezclaLab(CINTAS_LAB[i][0], CINTAS_LAB[j][0], t)),
    pie: labARgb(mezclaLab(CINTAS_LAB[i][1], CINTAS_LAB[j][1], t)),
  };
}

/**
 * Una cinta es la suma de tres senos con frecuencias inconmensurables: la
 * línea nunca se repite, así que la aurora no delata su bucle.
 */
export type Cinta = {
  base: number;
  alto: number;
  f: [number, number, number];
  v: [number, number, number];
  a: [number, number, number];
  d: [number, number, number];
};

export function cintas(cuantas: number, llave = "aurora-historia"): Cinta[] {
  const r = prng(semilla(llave));
  return Array.from({ length: cuantas }, (_, i) => ({
    base: 0.16 + (i / cuantas) * 0.44 + r() * 0.08,
    alto: 0.055 + r() * 0.09,
    f: [1.4 + r() * 1.4, 2.8 + r() * 1.8, 5 + r() * 2.6],
    v: [0.06 + r() * 0.05, -0.04 - r() * 0.04, 0.02 + r() * 0.03],
    a: [0.09 + r() * 0.07, 0.04 + r() * 0.03, 0.015 + r() * 0.015],
    d: [r() * 6.28, r() * 6.28, r() * 6.28],
  }));
}

/** La ondulación de la cinta en x (0..1) y el tiempo t (segundos). */
export function alturaCinta(c: Cinta, x: number, t: number): number {
  return (
    c.base +
    Math.sin(x * c.f[0] + t * c.v[0] + c.d[0]) * c.a[0] +
    Math.sin(x * c.f[1] + t * c.v[1] + c.d[1]) * c.a[1] +
    Math.sin(x * c.f[2] + t * c.v[2] + c.d[2]) * c.a[2]
  );
}
