"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { useFavoritos } from "@/lib/favoritos";
import { COLECCIONES } from "@/lib/colecciones";
import { VerseMark } from "./verse-mark";
import s from "./nav.module.css";


/**
 * El nav flota sobre paneles que alternan noche y seda, así que no puede tener
 * un color fijo: mide qué panel queda bajo su línea base y adopta ese mundo.
 * Es lo que permite que no haya barra opaca ni blur tapando la composición.
 */
function useNav(): { tono: "noche" | "seda"; oculto: boolean } {
  const [tono, setTono] = useState<"noche" | "seda">("noche");
  // El nav flota sin barra opaca, así que se retira al bajar en vez de
  // quedarse encima de los titulares. Al subir vuelve de inmediato.
  const [oculto, setOculto] = useState(false);

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

  return { tono, oculto };
}

export default function Nav() {
  const { tono, oculto } = useNav();
  const { piezas, listo } = useCart();
  const { cuenta: favoritos, listo: favoritosListo } = useFavoritos();
  const [coleccionesAbierto, setColeccionesAbierto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cerrarAlClicAfuera = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setColeccionesAbierto(false);
      }
    };

    const cerrarConEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setColeccionesAbierto(false);
    };

    if (coleccionesAbierto) {
      document.addEventListener("mousedown", cerrarAlClicAfuera);
      document.addEventListener("keydown", cerrarConEscape);
      return () => {
        document.removeEventListener("mousedown", cerrarAlClicAfuera);
        document.removeEventListener("keydown", cerrarConEscape);
      };
    }
  }, [coleccionesAbierto]);

  return (
    <nav
      className={`${s.nav} ${oculto ? s.oculta : ""}`}
      data-panel={tono}
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
        <div className={s.coleccionesMenu} ref={menuRef}>
          <button
            className={`${s.coleccionesToggle} link`}
            onClick={() => setColeccionesAbierto(!coleccionesAbierto)}
            aria-expanded={coleccionesAbierto}
          >
            Colecciones
          </button>
          {coleccionesAbierto && (
            <div className={s.coleccionesDropdown}>
              {COLECCIONES.map((col) => (
                <Link
                  key={col.id}
                  href={col.ruta}
                  className={s.coleccionLink}
                  onClick={() => setColeccionesAbierto(false)}
                >
                  {col.nombre}
                </Link>
              ))}
              <Link
                href="/colecciones"
                className={s.coleccionLink}
                onClick={() => setColeccionesAbierto(false)}
              >
                Ver todas
              </Link>
            </div>
          )}
        </div>
        <Link href="/blog" className="link">
          Diario
        </Link>
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
            <span className={s.cuenta} aria-label={`${favoritos} piezas guardadas`}>
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
            <span className={s.cuenta} aria-label={`${piezas} piezas`}>
              {piezas}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
