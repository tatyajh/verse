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
      "Por qué organizamos la colección por las horas de una noche y no por tipo de prenda.",
    fecha: "2026-09-17",
    cuerpo: [
      {
        tipo: "parrafo",
        texto:
          "En casi todas las tiendas la lencería se ordena por categoría: bras por un lado, panties por otro, conjuntos al final. Sirve para encontrar una talla, pero no dice nada de cómo te quieres sentir. Aurora la ordenamos por la hora de la noche en que pensamos cada pieza.",
      },
      {
        tipo: "parrafo",
        texto:
          "Noctis es la medianoche: negro profundo y dorado. Vigilia es ese rato en que algo empieza a moverse en el horizonte, en azules de tinta. Borealis es cuando el cielo se enciende, en verde jade y lila. Prima Luce es la primera luz del día, en perla y rosado. Son cuatro momentos y veinte piezas.",
      },
      {
        tipo: "cita",
        texto: "Una noche. Mil versiones.",
      },
      {
        tipo: "parrafo",
        texto:
          "No tienes que quedarte con una. Hoy puedes andar en Noctis y el sábado en Prima Luce, y las dos te quedan.",
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
