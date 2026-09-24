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
      "Había nevado toda la tarde y el pueblo ya dormía.",
      "Ella salió sin abrigo.",
      "El frío no la tocó: se le quedó en el pelo, en las pestañas.",
      "Caminó hasta donde terminan las casas.",
      "Allí la oscuridad no era vacío. Era terciopelo.",
      "Se quedó quieta, con las manos frías y los ojos abiertos.",
      "Y esperó.",
    ],
  },
  {
    romano: "II",
    latin: "Vigilia",
    titulo: "La hora azul",
    tonalidad: "vigilia",
    intensidad: 0.18,
    versos: [
      "Pasó una hora. Tal vez dos.",
      "El cielo cambió primero en el borde.",
      "Un azul de tinta, y debajo otro más claro.",
      "En el valle nada se movía.",
      "Solo su aliento, blanco, subiendo despacio.",
      "Hacía tiempo había dejado de apurar lo que vale la pena.",
      "La noche también estaba esperando.",
    ],
  },
  {
    romano: "III",
    latin: "Borealis",
    titulo: "Cuando el cielo se enciende",
    tonalidad: "borealis",
    intensidad: 1,
    versos: [
      "Entonces empezó.",
      "Una franja verde se abrió sobre las montañas, lenta, como seda que alguien desdobla.",
      "Detrás vino el violeta.",
      "La luz se plegaba y se volvía a plegar.",
      "Sobre la nieve, todo tomó color.",
      "También ella.",
      "Se soltó el pelo.",
      "Bailó sin testigos, que es la única forma honesta de bailar.",
      "Esa noche fue muchas mujeres.",
      "Y ninguna le sobró.",
    ],
  },
  {
    romano: "IV",
    latin: "Prima Luce",
    titulo: "La primera luz",
    tonalidad: "prima-luce",
    intensidad: 0.35,
    versos: [
      "Con la madrugada, el verde se fue apagando.",
      "El cielo pasó a perla, y de perla a rosa.",
      "Ella volvió por el mismo camino.",
      "Sus huellas seguían ahí, ahora con luz.",
      "Nadie la vio llegar.",
      "Pero algo de esa noche se le quedó en la piel.",
    ],
  },
];

export function getCapitulo(tonalidad: Tonalidad): Capitulo | undefined {
  return CAPITULOS.find((c) => c.tonalidad === tonalidad);
}
