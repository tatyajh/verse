"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { VerseMark } from "./verse-mark";
import s from "./umbral.module.css";

// Cuántas veces se ha montado la caja en esta visita: la primera la decide el
// script del layout; las siguientes son cambios de ruta.
let montajes = 0;

/**
 * «Umbral» — la caja se abre.
 *
 * La llave es el símbolo de la marca, así que el sitio empieza cerrado: dos
 * hojas de seda unidas por una costura que se separan al entrar y cada vez
 * que se cambia de página. Los cambios de filtro dentro de una misma página
 * no la disparan.
 *
 * Al entrar lo decide el script síncrono del layout (una vez por sesión),
 * que marca `data-umbral` antes del primer pintado. Sin JS, o con movimiento
 * reducido, el atributo nunca se pone y el CSS deja las hojas ocultas.
 */
export default function Umbral() {
  const ruta = usePathname();
  // Una caja nueva por ruta: al cambiar de página se monta cerrada y se abre.
  return <Caja key={ruta} />;
}

function Caja() {
  const [abierto, setAbierto] = useState(false);
  // La primera caja es la de entrada; las siguientes, cambios de página.
  const [rapida] = useState(() => montajes > 0);

  // Antes de pintar la página nueva, la caja ya está cerrada encima: nunca
  // se ve un destello de la página antes de que la seda la tape.
  useLayoutEffect(() => {
    if (montajes++ === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.dataset.umbral = "nuevo";
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.umbral !== "nuevo") return;
    // Entre páginas la apertura es más corta que al entrar al sitio.
    const navegacion = rapida;

    let vivo = true;
    const cerrar = () => {
      if (!vivo) return;
      vivo = false;
      try {
        sessionStorage.setItem("verse.umbral", "1");
      } catch {
        /* modo privado: se volverá a abrir, no es grave */
      }
      html.dataset.umbral = "visto"; // libera el scroll
    };

    // Esperar a las fuentes evita que el hero aparezca con la tipografía de respaldo.
    const listo = document.fonts?.ready ?? Promise.resolve();
    const abrir = window.setTimeout(
      () => {
        void listo.then(() => {
          if (vivo) setAbierto(true);
        });
      },
      navegacion ? 90 : 260,
    );

    // La transición dura 1.4s (1s entre páginas); después se retira la caja.
    const retirar = window.setTimeout(cerrar, navegacion ? 1250 : 2400);
    // Failsafe: si algo falla antes, el scroll no queda bloqueado.
    const failsafe = window.setTimeout(cerrar, 5000);

    return () => {
      window.clearTimeout(abrir);
      window.clearTimeout(retirar);
      window.clearTimeout(failsafe);
      cerrar();
    };
  }, [rapida]);

  return (
    <div
      className={`${s.umbral} ${abierto ? s.abierto : ""} ${rapida ? s.rapida : ""}`}
      aria-hidden="true"
      inert
    >
      {/* La seda ondea: ruido que se mueve y desplaza la imagen como tela al
          aire. Se intensifica cuando las hojas se abren. Solo vive mientras
          la caja está en pantalla (una vez por sesión). */}
      <svg className={s.filtros} aria-hidden="true" focusable="false">
        <filter id="umbral-ondas" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.012" numOctaves="2" seed="7">
            <animate
              attributeName="baseFrequency"
              dur="3.2s"
              values="0.004 0.012;0.006 0.016;0.004 0.012"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale={abierto ? 70 : 26}>
            <animate
              attributeName="scale"
              dur="2.4s"
              values={abierto ? "70;46;70" : "26;38;26"}
              repeatCount="indefinite"
            />
          </feDisplacementMap>
        </filter>
      </svg>
      <div className={`${s.hoja} ${s.izq}`} />
      <div className={`${s.hoja} ${s.der}`} />
      <div className={s.costura} />
      <div className={s.sello}>
        {/* La llave completa del logo, nunca recortada. */}
        <VerseMark size={62} />
      </div>
    </div>
  );
}
