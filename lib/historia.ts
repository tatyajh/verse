import type { Tonalidad } from "./products";

/**
 * Aurora: una noche. Mil versiones.
 *
 * El relato de la colección, en cuatro capítulos que son los cuatro
 * momentos. No es una página «sobre nosotras»: es la misma columna
 * vertebral del catálogo contada en prosa. Cada capítulo termina en un
 * umbral hacia sus piezas.
 *
 * El verso corto es deliberado —así lo escribió Moni—. Cada frase
 * respira sola; el texto deja espacio a la imaginación en vez de
 * explicarlo todo.
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
  cita: "Hay noches que terminan al amanecer. Otras permanecen para siempre.",
} as const;

/** El cierre, y el lema de la colección. */
export const CIERRE = {
  primera: "Algunas historias nunca terminan.",
  segunda: "Solo encuentran una nueva forma de comenzar.",
} as const;

export const CAPITULOS: Capitulo[] = [
  {
    romano: "I",
    latin: "Noctis",
    titulo: "La noche guarda un secreto",
    tonalidad: "noctis",
    intensidad: 0,
    versos: [
      "La nieve dormía bajo un cielo inmenso cuando ella apareció.",
      "No dejó huellas.",
      "Solo una sensación imposible de nombrar.",
      "La oscuridad parecía reconocerla.",
      "Como si ambas compartieran un secreto antiguo.",
      "Y mientras el mundo permanecía en silencio, la noche abrió una puerta que nadie más podía ver.",
    ],
  },
  {
    romano: "II",
    latin: "Vigilia",
    titulo: "Donde nacen las promesas",
    tonalidad: "vigilia",
    intensidad: 0.18,
    versos: [
      "Algo se movió en el horizonte.",
      "No era luz.",
      "No todavía.",
      "Era la promesa de algo extraordinario.",
      "El aire se volvió más ligero.",
      "Las estrellas más cercanas.",
      "Y por primera vez, la noche pareció contener la respiración.",
      "Ella sonrió.",
      "Como quien sabe que la magia siempre llega a quienes saben esperar.",
    ],
  },
  {
    romano: "III",
    latin: "Borealis",
    titulo: "La danza de lo imposible",
    tonalidad: "borealis",
    intensidad: 1,
    versos: [
      "Entonces el cielo comenzó a arder.",
      "Ríos de luz recorrieron la oscuridad.",
      "Verdes.",
      "Violetas.",
      "Destellos imposibles de atrapar.",
      "La aurora bailaba sobre la nieve como un sueño despierto.",
      "Y ella bailó con ella.",
      "Sin miedo.",
      "Sin límites.",
      "Sin elegir una sola versión de sí misma.",
      "Porque algunas mujeres nacieron para ser muchas.",
    ],
  },
  {
    romano: "IV",
    latin: "Prima Luce",
    titulo: "El arte de permanecer",
    tonalidad: "prima-luce",
    intensidad: 0.35,
    versos: [
      "Cuando apareció la primera luz del día, la aurora comenzó a desvanecerse.",
      "Pero no desapareció.",
      "Se quedó suspendida en el aire, como un recuerdo que se niega a partir.",
      "Ella observó el horizonte una última vez.",
      "La noche había terminado.",
      "El encanto no.",
      "Y mientras el nuevo día despertaba, comprendió que algunas historias nunca terminan.",
      "Solo encuentran una nueva forma de comenzar.",
    ],
  },
];

/**
 * El último verso de Borealis y los dos primeros de cada capítulo cargan
 * el peso: se componen a mayor escala. Aquí se marca cuál destaca.
 */
export const VERSO_DESTACADO: Record<string, number> = {
  Borealis: 10,
};

export function getCapitulo(tonalidad: Tonalidad): Capitulo | undefined {
  return CAPITULOS.find((c) => c.tonalidad === tonalidad);
}
