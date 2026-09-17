"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { VerseMark } from "./verse-mark";
import s from "./nav.module.css";

const COLECCIONES = [
  { id: "aurora", nombre: "Aurora", historia: "Una noche. Mil versiones." },
];

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
  const [coleccionesAbierto, setColeccionesAbierto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cerrarAlClicAfuera = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setColeccionesAbierto(false);
      }
    };

    if (coleccionesAbierto) {
      document.addEventListener("mousedown", cerrarAlClicAfuera);
      return () => document.removeEventListener("mousedown", cerrarAlClicAfuera);
    }
  }, [coleccionesAbierto]);

  return (
    <nav
      className={`${s.nav} ${oculto ? s.oculta : ""}`}
      data-panel={tono}
      aria-label="Principal"
    >
      <Link href="/" className={s.marca}>
        <VerseMark size={28} />
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
                <div key={col.id}>
                  <Link
                    href={`/${col.id}`}
                    className={s.coleccionLink}
                    onClick={() => setColeccionesAbierto(false)}
                  >
                    {col.nombre}
                  </Link>
                  <Link
                    href={`/${col.id}/historia`}
                    className={`${s.coleccionLink} ${s.coleccionHistoria}`}
                    onClick={() => setColeccionesAbierto(false)}
                  >
                    La historia
                    <span>{col.historia}</span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        <Link href="/#llave" className={`link ${s.oculto}`}>
          La llave
        </Link>
        <Link href="/carrito" className={`${s.carrito} link`}>
          Carrito
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
