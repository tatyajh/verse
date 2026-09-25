"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { useFavoritos } from "@/lib/favoritos";
import { VerseMark } from "./verse-mark";
import MenuSeda from "./firmas/menu-seda";
import s from "./nav.module.css";


/**
 * El nav flota sobre paneles que alternan noche y seda, así que no puede tener
 * un color fijo: mide qué panel queda bajo su línea base y adopta ese mundo.
 * Es lo que permite que no haya barra opaca ni blur tapando la composición.
 */
function useNav(): { tono: "noche" | "seda"; oculto: boolean; conFondo: boolean } {
  const [tono, setTono] = useState<"noche" | "seda">("noche");
  // El nav flota sin barra opaca, así que se retira al bajar en vez de
  // quedarse encima de los titulares. Al subir vuelve de inmediato.
  const [oculto, setOculto] = useState(false);
  // Arriba del todo el nav va limpio sobre el hero; al bajar gana un fondo
  // que se desvanece, para no montarse sobre el texto.
  const [conFondo, setConFondo] = useState(false);

  useEffect(() => {
    let frame = 0;
    let anterior = window.scrollY;

    const medir = () => {
      frame = 0;
      const linea = 28; // altura óptica del nav
      const paneles = document.querySelectorAll<HTMLElement>("[data-panel]");
      let encontrado: "noche" | "seda" | null = null;
      for (const panel of paneles) {
        const r = panel.getBoundingClientRect();
        if (r.top <= linea && r.bottom > linea) {
          const t = panel.dataset.panel;
          if (t === "noche" || t === "seda") encontrado = t;
        }
      }
      setTono(encontrado ?? "noche");

      const y = window.scrollY;
      setConFondo(y > 40);
      if (Math.abs(y - anterior) > 6) {
        setOculto(y > anterior && y > 160);
        anterior = y;
      }
    };

    const alDesplazar = () => {
      if (frame) return;
      frame = requestAnimationFrame(medir);
    };

    medir();
    window.addEventListener("scroll", alDesplazar, { passive: true });
    window.addEventListener("resize", alDesplazar);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", alDesplazar);
      window.removeEventListener("resize", alDesplazar);
    };
  }, []);

  return { tono, oculto, conFondo };
}

export default function Nav() {
  const { tono, oculto, conFondo } = useNav();
  const { piezas, listo } = useCart();
  const { cuenta: favoritos, listo: favoritosListo } = useFavoritos();

  return (
    <nav
      className={`${s.nav} ${oculto ? s.oculta : ""}`}
      data-panel={tono}
      data-fondo={conFondo ? "si" : undefined}
      aria-label="Principal"
    >
      <Link href="/" className={s.marca}>
        {/* Los dos acabados apilados y fundidos por CSS según el panel: un
            solo <img> no puede transicionar de color. */}
        <span className={s.emblema}>
          <VerseMark size={28} className={s.emblemaClaro} />
          <VerseMark size={28} hondo className={s.emblemaHondo} />
        </span>
        <span className={s.marcaTexto}>
          <span className={s.marcaNombre}>Versé</span>
          <span className={s.marcaSufijo}>Intimates</span>
        </span>
      </Link>

      <div className={`${s.menu} label`}>
        <MenuSeda conEmblema={false} />
        <Link href="/favoritos" className={`${s.carrito} link`} aria-label="Favoritos">
          <span className={s.etiqueta}>Favoritos</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" className={s.iconoMovil}>
            <path
              d="M12 20.5 4.2 12.9a5 5 0 0 1 7.1-7l.7.7.7-.7a5 5 0 1 1 7.1 7Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          {favoritosListo && favoritos > 0 && (
            <span className={s.cuenta} aria-label={`${favoritos} productos guardados`}>
              {favoritos}
            </span>
          )}
        </Link>
        <Link href="/carrito" className={`${s.carrito} link`} aria-label="Carrito">
          <span className={s.etiqueta}>Carrito</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" className={s.iconoMovil}>
            <path
              d="M6 8h12l-1 12H7Zm3 0V6a3 3 0 0 1 6 0v2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          {listo && piezas > 0 && (
            <span className={s.cuenta} aria-label={`${piezas} productos en el carrito`}>
              {piezas}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
