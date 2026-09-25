import type { Tonalidad } from "./products";

/**
 * La historia de Aurora: un capítulo por momento del catálogo, y cada uno
 * termina en un enlace a sus piezas.
 *
 * Un verso por línea: la página los compone uno a uno y el último de cada
 * capítulo va destacado.
 */

export type Capitulo = {
  /** Numeral romano, tal como abre el capítulo. */
  romano: string;
  /** El nombre latino: el que da carácter. */
  latin: string;
  /** Lo que promete el capítulo. */
  titulo: string;
  /** El momento del catálogo al que abre. */
  tonalidad: Tonalidad;
  /** Cada frase es un verso, no un párrafo. */
  versos: string[];
  /**
   * Cuánto arde la aurora aquí, de 0 a 1. Es la curva dramática del
   * relato: la noche no tiene luz, Borealis es el incendio.
   */
  intensidad: number;
};

export const OBERTURA = {
  lema: "Una noche. Mil versiones.",
  cita: "Una noche en la nieve, contada en cuatro horas.",
} as const;

/** El cierre de la historia, después del último capítulo. */
export const CIERRE = {
  primera: "Algunas noches terminan al amanecer.",
  segunda: "Otras se quedan puestas.",
} as const;

export const CAPITULOS: Capitulo[] = [
  {
    romano: "I",
    latin: "Noctis",
    titulo: "Lo que la nieve no cuenta",
    tonalidad: "noctis",
    intensidad: 0,
    versos: [
      "Había nevado toda la tarde y el pueblo ya dormía cuando ella salió sin abrigo.",
      "El frío se le quedó en el pelo y en las pestañas mientras caminaba hasta donde terminan las casas.",
      "Allí la oscuridad tenía la textura del terciopelo.",
      "Se quedó quieta, con las manos frías, a esperar.",
    ],
  },
  {
    romano: "II",
    latin: "Vigilia",
    titulo: "La hora azul",
    tonalidad: "vigilia",
    intensidad: 0.18,
    versos: [
      "Pasó una hora, tal vez dos, y el cielo empezó a cambiar por el borde.",
      "Primero fue un azul de tinta; debajo apareció otro más claro.",
      "En el valle nada se movía, solo su aliento, que subía blanco y despacio.",
      "Ella no tenía prisa, y la noche tampoco.",
    ],
  },
  {
    romano: "III",
    latin: "Borealis",
    titulo: "Cuando el cielo se enciende",
    tonalidad: "borealis",
    intensidad: 1,
    versos: [
      "Sobre las montañas se abrió una franja verde, lenta, como seda que alguien desdobla.",
      "Detrás vino el violeta, y la luz empezó a plegarse sobre sí misma.",
      "La nieve tomó el color del cielo, y ella también.",
      "Se soltó el pelo y bailó sin testigos.",
      "Esa noche fue muchas mujeres, y ninguna le sobró.",
    ],
  },
  {
    romano: "IV",
    latin: "Prima Luce",
    titulo: "La primera luz",
    tonalidad: "prima-luce",
    intensidad: 0.35,
    versos: [
      "Con la madrugada el verde se apagó; el cielo pasó a perla y después a rosa.",
      "Ella volvió por el mismo camino y encontró sus huellas, ahora con luz.",
      "Nadie la vio llegar, pero algo de esa noche se le quedó en la piel.",
    ],
  },
];

export function getCapitulo(tonalidad: Tonalidad): Capitulo | undefined {
  return CAPITULOS.find((c) => c.tonalidad === tonalidad);
}
