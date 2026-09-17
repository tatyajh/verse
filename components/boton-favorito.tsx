"use client";

import { useFavoritos } from "@/lib/favoritos";
import s from "./boton-favorito.module.css";

/**
 * El corazón se dibuja con trazo y se rellena al guardarse: el mismo gesto
 * del emblema, que también es línea antes que mancha.
 */
export default function BotonFavorito({
  slug,
  nombre,
  className,
}: {
  slug: string;
  nombre: string;
  className?: string;
}) {
  const { listo, esFavorito, alternar } = useFavoritos();
  const guardada = listo && esFavorito(slug);

  return (
    <button
      type="button"
      className={`${s.boton} ${className ?? ""}`}
      data-guardada={guardada ? "" : undefined}
      aria-pressed={guardada}
      aria-label={guardada ? `Quitar ${nombre} de favoritos` : `Guardar ${nombre} en favoritos`}
      onClick={(e) => {
        // La tarjeta entera es un enlace: el corazón no debe navegar.
        e.preventDefault();
        e.stopPropagation();
        alternar(slug);
      }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className={s.icono}>
        <path
          d="M12 20.5 4.2 12.9a5 5 0 0 1 7.1-7l.7.7.7-.7a5 5 0 1 1 7.1 7Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
