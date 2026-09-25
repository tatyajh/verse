"use client";

import { useEffect, useState } from "react";
import { VerseMark } from "./verse-mark";
import s from "./umbral.module.css";

/**
 * «Umbral» — la caja se abre.
 *
 * La llave es el símbolo de la marca, así que el sitio empieza cerrado: dos
 * hojas unidas por una costura rose que se separan una sola vez por sesión.
 *
 * Quién decide si la apertura ocurre es el script síncrono del layout, que
 * marca `data-umbral` antes del primer pintado. Sin JS, o con movimiento
 * reducido, el atributo nunca se pone y el CSS deja las hojas ocultas: la
 * página se lee completa de una vez.
 */
export default function Umbral() {
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.umbral !== "nuevo") return;

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
    const abrir = window.setTimeout(() => {
      void listo.then(() => {
        if (vivo) setAbierto(true);
      });
    }, 260);

    // La transición dura 1.4s; se retira la hoja después.
    const retirar = window.setTimeout(cerrar, 2400);
    // Failsafe: si algo falla antes, el scroll no queda bloqueado.
    const failsafe = window.setTimeout(cerrar, 5000);

    return () => {
      window.clearTimeout(abrir);
      window.clearTimeout(retirar);
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <div
      className={`${s.umbral} ${abierto ? s.abierto : ""}`}
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
