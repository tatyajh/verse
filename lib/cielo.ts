import { createNoise3D } from "simplex-noise";
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
  ["#223f3a", "#2c524b", "#34615a", "#5b5680"], // Borealis — jade apagado hacia el lila
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
 * Una cinta ondula siguiendo un campo de ruido simplex, no una suma de
 * senos. Los senos, por muchos que se apilen, acaban delatando su
 * periodicidad: se «ve» el bucle. El ruido no tiene periodo, y eso es lo
 * que hace que la aurora parezca viva en vez de animada.
 *
 * Cada cinta recorre su propio carril del campo, así que ninguna imita a
 * otra pero todas comparten la misma física.
 */
export type Cinta = {
  /** Altura de reposo, en fracción del alto del lienzo. */
  base: number;
  /** Grosor de la cinta. */
  alto: number;
  /** Su calle dentro del campo de ruido: separa unas cintas de otras. */
  carril: number;
  /** Cuán largas son las ondas a lo ancho. */
  escala: number;
  /** Cuán rápido fluye el campo con el tiempo. */
  deriva: number;
  amplitud: number;
};

/* El campo se siembra con el mismo PRNG que los grabados: la aurora es la
   misma en cada recarga, como cada pieza tiene siempre su mismo encaje. */
let campo: ReturnType<typeof createNoise3D> | null = null;

function ruido() {
  if (!campo) campo = createNoise3D(prng(semilla("aurora-historia")));
  return campo;
}

export function cintas(cuantas: number, llave = "aurora-historia"): Cinta[] {
  const r = prng(semilla(llave));
  return Array.from({ length: cuantas }, (_, i) => ({
    base: 0.16 + (i / cuantas) * 0.44 + r() * 0.08,
    alto: 0.055 + r() * 0.09,
    carril: r() * 100,
    escala: 1.1 + r() * 0.9,
    deriva: 0.05 + r() * 0.05,
    amplitud: 0.1 + r() * 0.07,
  }));
}

/** La ondulación de la cinta en x (0..1) y el tiempo t (segundos). */
export function alturaCinta(c: Cinta, x: number, t: number): number {
  const n = ruido();
  return (
    c.base +
    // Onda larga: el cuerpo de la cinta.
    n(x * c.escala, c.carril, t * c.deriva) * c.amplitud +
    // Segunda octava: el temblor fino que tienen las auroras de verdad.
    n(x * c.escala * 2.6, c.carril + 31.7, t * c.deriva * 1.9) * c.amplitud * 0.32
  );
}

/* ---------- la tinta ---------- */

/**
 * De qué color va el texto encima del cielo.
 *
 * No puede decidirlo el capítulo: el texto cambiaba de golpe en el borde
 * de la sección mientras el cielo transicionaba poco a poco, así que al
 * entrar en Prima Luce quedaba tinta oscura sobre cielo todavía oscuro
 * —1.63:1, ilegible—. Aquí la tinta sigue la MISMA curva que el cielo.
 *
 * El halo es siempre el opuesto de la tinta: en el cruce, cuando el cielo
 * pasa por su gris medio, ninguna de las dos tintas contrasta bien, y es
 * el halo el que sostiene la lectura.
 */
const TINTA_CLARA = "233 227 219";
const TINTA_OSCURA = "43 28 61";

/** Luminancia relativa WCAG desde "r g b". */
function wcag(rgb: string): number {
  const [r, g, b] = rgb.split(" ").map((v) => {
    const c = Number(v) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const contraste = (a: number, b: number) =>
  (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

export function tintaEn(p: number): { tinta: string; halo: string; fuerza: number } {
  const { i, j, t } = tramo(p, CIELOS_LAB.length);
  // La L de las paradas centrales: es donde se apoya el texto.
  const claridad =
    [1, 2].reduce(
      (suma, k) => suma + mezclaLab(CIELOS_LAB[i][k], CIELOS_LAB[j][k], t)[0],
      0,
    ) / 2;

  void claridad;

  // No se elige por un umbral fijo —cualquier umbral deja un tramo malo—,
  // sino midiendo: gana la tinta que más contraste da contra TODAS las
  // paradas del cielo en ESTE punto. El texto ocupa toda la altura, así
  // que puede caer sobre cualquiera de ellas.
  const contra = [0, 1, 2, 3].map((k) =>
    wcag(labARgb(mezclaLab(CIELOS_LAB[i][k], CIELOS_LAB[j][k], t))),
  );
  const peor = (l: number) => Math.min(...contra.map((c) => contraste(l, c)));

  const conClara = peor(wcag(TINTA_CLARA));
  const conOscura = peor(wcag(TINTA_OSCURA));
  const gana = conClara >= conOscura;
  const logrado = Math.max(conClara, conOscura);

  // El amanecer pasa por un gris medio donde ninguna tinta llega a 4.5:1
  // —es el precio de que la noche se aclare de verdad—. Ahí el halo hace
  // el trabajo. Fuera de ese tramo se apaga solo y no ensucia la letra.
  const fuerza = Math.max(0, Math.min(1, (7 - logrado) / 4));

  return gana
    ? { tinta: TINTA_CLARA, halo: TINTA_OSCURA, fuerza }
    : { tinta: TINTA_OSCURA, halo: TINTA_CLARA, fuerza };
}
