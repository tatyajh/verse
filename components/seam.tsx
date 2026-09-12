"use client";

import { useEffect, useRef } from "react";
import s from "./panel.module.css";

/**
 * Línea rose de 1px que se "descose" desde el centro al entrar en pantalla.
 *
 * La clase se aplica sobre el DOM y no con estado de React: es un efecto
 * puramente visual sobre un elemento concreto, no información que ningún otro
 * componente necesite.
 */
export default function Seam() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      el.classList.add(s.seamOpen);
      return;
    }

    const io = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add(s.seamOpen);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -18% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref} className={s.seam} aria-hidden="true" />;
}
