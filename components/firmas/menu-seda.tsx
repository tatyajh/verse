"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { VerseMark } from "@/components/verse-mark";
import { COLECCIONES } from "@/lib/colecciones";
import { TONALIDADES } from "@/lib/products";
import s from "./menu-seda.module.css";

/**
 * Propuesta de navegación: un solo botón con el emblema. Al abrirlo, dos
 * hojas de seda se cierran desde los lados —la caja de entrada al revés— y
 * dejan el menú en letra grande. Escape o «Cerrar» lo abren de nuevo.
 */
const sinCambios = () => () => {};

export default function MenuSeda({
  conEmblema = true,
}: {
  conEmblema?: boolean;
}) {
  // El panel va al <body> con un portal: dentro del nav (que se desplaza al
  // bajar) un position: fixed quedaría atado a él.
  const montado = useSyncExternalStore(
    sinCambios,
    () => true,
    () => false,
  );
  const [abierto, setAbierto] = useState(false);
  const primero = useRef<HTMLAnchorElement>(null);
  const boton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!abierto) return;
    primero.current?.focus();
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAbierto(false);
        boton.current?.focus();
      }
    };
    document.addEventListener("keydown", tecla);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", tecla);
      document.documentElement.style.overflow = "";
    };
  }, [abierto]);

  const cerrar = () => setAbierto(false);

  return (
    <>
      <button
        ref={boton}
        type="button"
        className={s.boton}
        onClick={() => setAbierto(true)}
        aria-expanded={abierto}
        aria-controls="menu-seda"
      >
        {conEmblema && <VerseMark size={22} />}
        <span>Menú</span>
      </button>

      {montado &&
        createPortal(
          <div
            id="menu-seda"
            className={`${s.menu} ${abierto ? s.abierto : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
            aria-hidden={!abierto}
            inert={!abierto}
          >
            <div className={`${s.hoja} ${s.izq}`} />
            <div className={`${s.hoja} ${s.der}`} />
            <nav className={s.contenido}>
              <ul className={s.lista}>
                {COLECCIONES.map((c, i) => (
                  <li key={c.id}>
                    <Link
                      ref={i === 0 ? primero : undefined}
                      href={c.ruta}
                      className={s.grande}
                      onClick={cerrar}
                    >
                      {c.nombre}
                    </Link>
                    <span className={s.momentos}>
                      {TONALIDADES.map((t) => (
                        <Link
                          key={t.id}
                          href={`${c.productos}&momento=${t.id}`}
                          onClick={cerrar}
                        >
                          {t.nombre}
                        </Link>
                      ))}
                    </span>
                  </li>
                ))}
                <li>
                  <Link href="/productos" className={s.grande} onClick={cerrar}>
                    Todos los productos
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className={s.grande} onClick={cerrar}>
                    Diario
                  </Link>
                </li>
              </ul>
              <div className={s.pie}>
                <Link href="/favoritos" onClick={cerrar}>
                  Favoritos
                </Link>
                <Link href="/carrito" onClick={cerrar}>
                  Carrito
                </Link>
                <button type="button" onClick={cerrar} className={s.cerrar}>
                  Cerrar
                </button>
              </div>
            </nav>
          </div>,
          document.body,
        )}
    </>
  );
}
