"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { getProduct, type Product } from "./products";

/**
 * Favoritos.
 *
 * Mismo contrato que el carrito: en el almacenamiento solo viven slugs, y la
 * pieza se resuelve siempre desde products.ts. Una lista vieja —o editada a
 * mano— no puede inventar una pieza que no existe.
 *
 * Vive en el dispositivo, no en una cuenta: no la sigue de su celular a su
 * computador. Es la decisión consciente de no pedirle registro para guardar
 * algo que le gustó.
 */

const CLAVE = "verse.favoritos.v1";
const VACIO: string[] = [];

let cache: string[] | null = null;
const oyentes = new Set<() => void>();

function leer(): string[] {
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    if (!crudo) return VACIO;
    const dato: unknown = JSON.parse(crudo);
    if (!Array.isArray(dato)) return VACIO;
    const limpio = dato.filter(
      (slug): slug is string => typeof slug === "string" && getProduct(slug) !== undefined,
    );
    return limpio.length === 0 ? VACIO : limpio;
  } catch {
    return VACIO;
  }
}

function instantanea(): string[] {
  if (cache === null) cache = leer();
  return cache;
}

function instantaneaServidor(): string[] {
  return VACIO;
}

function guardar(siguiente: string[]) {
  cache = siguiente;
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(siguiente));
  } catch {
    /* modo privado o cuota llena: la lista sigue viva en memoria */
  }
  for (const avisar of oyentes) avisar();
}

function suscribir(avisar: () => void): () => void {
  oyentes.add(avisar);
  const enOtraPestana = (e: StorageEvent) => {
    if (e.key === CLAVE) {
      cache = null;
      avisar();
    }
  };
  window.addEventListener("storage", enOtraPestana);
  return () => {
    oyentes.delete(avisar);
    window.removeEventListener("storage", enOtraPestana);
  };
}

const siempreListo = () => true;
const nuncaListo = () => false;

export function useFavoritos() {
  const slugs = useSyncExternalStore(suscribir, instantanea, instantaneaServidor);
  // false mientras React hidrata: evita pintar el corazón vacío por un frame.
  const listo = useSyncExternalStore(suscribir, siempreListo, nuncaListo);

  const alternar = useCallback((slug: string) => {
    if (!getProduct(slug)) return;
    const actual = instantanea();
    guardar(
      actual.includes(slug) ? actual.filter((s) => s !== slug) : [...actual, slug],
    );
  }, []);

  const quitar = useCallback((slug: string) => {
    guardar(instantanea().filter((s) => s !== slug));
  }, []);

  const esFavorito = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const piezas = useMemo<Product[]>(
    () => slugs.flatMap((slug) => {
      const p = getProduct(slug);
      return p ? [p] : [];
    }),
    [slugs],
  );

  return { listo, piezas, cuenta: piezas.length, esFavorito, alternar, quitar };
}
