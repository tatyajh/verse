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
