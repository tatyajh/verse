/**
 * Entradas del diario. No hay CMS: para publicar una nueva se agrega al
 * principio del arreglo (el orden del archivo es el orden en pantalla) y
 * se despliega.
 *
 * `fecha` en formato ISO (AAAA-MM-DD) para que ordene y se lea igual en
 * cualquier navegador.
 */

export type Bloque =
  | { tipo: "parrafo"; texto: string }
  | { tipo: "subtitulo"; texto: string }
  | { tipo: "cita"; texto: string };

export type Entrada = {
  slug: string;
  titulo: string;
  resumen: string;
  fecha: string;
  cuerpo: Bloque[];
};

export const ENTRADAS: Entrada[] = [
  {
    slug: "por-que-aurora",
    titulo: "Por qué Aurora",
    resumen:
      "Por qué la colección se ordena por las horas de una noche y no por tipo de prenda.",
    fecha: "2026-09-17",
    cuerpo: [
      {
        tipo: "parrafo",
        texto:
          "La lencería suele ordenarse por categoría: bras, panties, conjuntos. Es práctico, pero no dice nada de la mujer que la lleva. Aurora se ordena por las horas de una noche.",
      },
      {
        tipo: "parrafo",
        texto:
          "Noctis es la medianoche, en negro y oro. Vigilia, la hora azul en que el cielo empieza a cambiar. Borealis, el momento en que se enciende, en jade y lila. Prima Luce, la primera luz, en perla y rosa. En total son cuatro momentos y veinte piezas.",
      },
      {
        tipo: "cita",
        texto: "Una noche. Mil versiones.",
      },
      {
        tipo: "parrafo",
        texto:
          "No hace falta quedarse con una. La misma mujer puede ser Noctis un martes y Prima Luce el domingo.",
      },
    ],
  },
  {
    slug: "como-elegir-tu-talla",
    titulo: "Cómo elegir tu talla",
    resumen:
      "Tres medidas, una cinta métrica y qué hacer cuando quedas justo entre dos tallas.",
    fecha: "2026-09-10",
    cuerpo: [
      {
        tipo: "parrafo",
        texto:
          "Necesitas una cinta métrica de costura y, si puedes, que alguien más te ayude. Mide sobre la piel o sobre ropa muy delgada, nunca sobre un bra con relleno.",
      },
      { tipo: "subtitulo", texto: "Busto" },
      {
        tipo: "parrafo",
        texto:
          "La cinta pasa por la parte más llena del busto, paralela al piso, sin apretar. Respira normal y deja que la cinta descanse.",
      },
      { tipo: "subtitulo", texto: "Cintura" },
      {
        tipo: "parrafo",
        texto:
          "En la parte más angosta del torso, normalmente un poco arriba del ombligo. Si te doblas hacia un lado, el pliegue que se forma marca dónde va.",
      },
      { tipo: "subtitulo", texto: "Cadera" },
      {
        tipo: "parrafo",
        texto:
          "En la parte más ancha, con los pies juntos. Suele estar unos 20 centímetros debajo de la cintura.",
      },
      { tipo: "subtitulo", texto: "Si quedas entre dos tallas" },
      {
        tipo: "parrafo",
        texto:
          "Escríbenos con tus tres medidas y te decimos cuál pedir. En el primer pedido el cambio de talla no tiene costo, así que no tienes que adivinar sola.",
      },
    ],
  },
];

export function getEntrada(slug: string): Entrada | undefined {
  return ENTRADAS.find((e) => e.slug === slug);
}

/** "17 de septiembre de 2026" a partir de la fecha ISO, sin depender del reloj. */
export function formatFecha(iso: string): string {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return new Date(Date.UTC(ano, mes - 1, dia)).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
