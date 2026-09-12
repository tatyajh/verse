"use client";

import { useSyncExternalStore } from "react";

/**
 * Consulta una media query sin desincronizar la hidratación.
 *
 * En el servidor devuelve false y React lo sabe: usa el snapshot de servidor
 * al hidratar y vuelve a renderizar con el valor real después. Hacerlo con
 * useState + useEffect provoca un render en cascada y una advertencia.
 */
export function useMedia(consulta: string): boolean {
  return useSyncExternalStore(
    (avisar) => {
      const mq = window.matchMedia(consulta);
      mq.addEventListener("change", avisar);
      return () => mq.removeEventListener("change", avisar);
    },
    () => window.matchMedia(consulta).matches,
    () => false,
  );
}
