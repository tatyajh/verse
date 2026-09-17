"use client";

/**
 * El avance de la página, de 0 a 1, con un solo requestAnimationFrame
 * para todo el sitio.
 *
 * La regla: el listener de scroll NUNCA lee el DOM —solo marca sucio—, y
 * el bucle lee una vez por frame antes de repartir. Así nadie provoca un
 * recálculo de estilo en mitad de las escrituras.
 */

type Oyente = (avance: number, tiempo: number) => void;

const oyentes = new Set<Oyente>();

let avance = 0;
let sucio = true;
let alto = 0;
let frame = 0;
let inicio = 0;

function medir() {
  alto = document.documentElement.scrollHeight - window.innerHeight;
  sucio = true;
}

function leer() {
  if (!sucio) return;
  sucio = false;
  avance = alto > 0 ? Math.max(0, Math.min(1, window.scrollY / alto)) : 0;
}

function tick(t: number) {
  frame = requestAnimationFrame(tick);
  leer();
  const segundos = (t - inicio) / 1000;
  for (const oyente of oyentes) oyente(avance, segundos);
}

function arrancar() {
  if (frame) return;
  inicio = performance.now();
  frame = requestAnimationFrame(tick);
}

function parar() {
  if (!frame) return;
  cancelAnimationFrame(frame);
  frame = 0;
}

const alDesplazar = () => {
  sucio = true;
};

const alCambiarVisibilidad = () => {
  // Sin pestaña, sin gasto: el navegador ya ralentiza el rAF, pero esto lo
  // apaga del todo y evita un salto de tiempo al volver.
  if (document.hidden) parar();
  else arrancar();
};

let observador: ResizeObserver | null = null;

export function suscribir(oyente: Oyente): () => void {
  const primero = oyentes.size === 0;
  oyentes.add(oyente);

  if (primero) {
    medir();
    window.addEventListener("scroll", alDesplazar, { passive: true });
    window.addEventListener("resize", medir);
    document.addEventListener("visibilitychange", alCambiarVisibilidad);

    // Las fuentes cambian la altura del documento al cargar; sin esto el
    // avance da un salto cuando entra Cormorant. Es el mismo cuidado que
    // ya tiene <Umbral/>.
    document.fonts?.ready.then(medir);

    observador = new ResizeObserver(medir);
    observador.observe(document.documentElement);

    arrancar();
  }

  // Un primer reparto inmediato: quien llega con el scroll ya restaurado
  // —un ancla, una vuelta atrás— debe ver su cielo antes del primer frame,
  // no un negro que se corrige a los 16 ms. También deja la página correcta
  // en pestañas ocultas, donde el rAF no corre.
  inicio = inicio || performance.now();
  leer();
  oyente(avance, (performance.now() - inicio) / 1000);

  return () => {
    oyentes.delete(oyente);
    if (oyentes.size > 0) return;

    parar();
    window.removeEventListener("scroll", alDesplazar);
    window.removeEventListener("resize", medir);
    document.removeEventListener("visibilitychange", alCambiarVisibilidad);
    observador?.disconnect();
    observador = null;
  };
}
