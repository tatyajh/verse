/**
 * El diario de la casa.
 *
 * Las entradas viven aquí, como la historia de Aurora: sin CMS ni base de
 * datos. Para publicar una nueva, se agrega al principio del arreglo —el
 * orden del archivo es el orden en que se leen— y se despliega.
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
      "Una colección que no se organiza por tallas ni por tipos de prenda, sino por las horas de una noche.",
    fecha: "2026-09-17",
    cuerpo: [
      {
        tipo: "parrafo",
        texto:
          "Casi toda la lencería se ordena por categoría: bras por un lado, panties por otro, conjuntos al final. Es cómodo para quien vende y frío para quien compra. Aurora se ordena distinto: por el momento de la noche en que fue pensada.",
      },
      {
        tipo: "parrafo",
        texto:
          "Noctis es la medianoche, el negro profundo y el dorado. Vigilia es la penumbra, cuando el azul empieza a moverse. Borealis es la primera luz, el verde jade y el lila. Prima Luce es el amanecer, la perla y el rosado. Cuatro momentos, veinte piezas.",
      },
      {
        tipo: "cita",
        texto: "Una noche. Mil versiones.",
      },
      {
        tipo: "parrafo",
        texto:
          "La idea no es que elijas una y descartes las otras tres. Es que reconozcas en cuál estás hoy, y que mañana puedas estar en otra sin sentir que te contradices.",
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
