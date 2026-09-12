"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { getProduct, type Product, type Talla } from "./products";

/**
 * Carrito.
 *
 * En el almacenamiento solo viven identificadores. El nombre y el precio se
 * resuelven siempre desde products.ts, nunca desde localStorage: así un
 * carrito viejo —o editado a mano— no puede inyectar precios inventados.
 *
 * El estado vive en un store externo leído con useSyncExternalStore, que es
 * la forma correcta de sincronizar con localStorage: React usa el snapshot de
 * servidor al hidratar y el real después, sin desajuste ni render en cascada.
 */

export type CartLine = {
  slug: string;
  talla: Talla;
  cantidad: number;
};

export type ResolvedLine = CartLine & {
  producto: Product;
  subtotal: number;
};

const CLAVE = "verse.carrito.v1";
const MAX_POR_PIEZA = 9;
const VACIO: CartLine[] = [];

let cache: CartLine[] | null = null;
const oyentes = new Set<() => void>();

function leer(): CartLine[] {
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    if (!crudo) return VACIO;
    const dato: unknown = JSON.parse(crudo);
    if (!Array.isArray(dato)) return VACIO;
    const limpio = dato.flatMap((l): CartLine[] => {
      if (typeof l !== "object" || l === null) return [];
      const { slug, talla, cantidad } = l as Record<string, unknown>;
      if (typeof slug !== "string" || typeof talla !== "string") return [];
      const producto = getProduct(slug);
      if (!producto || !producto.tallas.includes(talla as Talla)) return [];
      const n = Number(cantidad);
      if (!Number.isFinite(n) || n < 1) return [];
      return [
        { slug, talla: talla as Talla, cantidad: Math.min(Math.floor(n), MAX_POR_PIEZA) },
      ];
    });
    return limpio.length === 0 ? VACIO : limpio;
  } catch {
    return VACIO;
  }
}

function instantanea(): CartLine[] {
  if (cache === null) cache = leer();
  return cache;
}

function instantaneaServidor(): CartLine[] {
  return VACIO;
}

function guardar(siguiente: CartLine[]) {
  cache = siguiente;
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(siguiente));
  } catch {
    /* modo privado o cuota llena: el carrito sigue vivo en memoria */
  }
  for (const avisar of oyentes) avisar();
}

function suscribir(avisar: () => void): () => void {
  oyentes.add(avisar);
  // Si la clienta tiene dos pestañas abiertas, ambas ven el mismo carrito.
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

export function useCart() {
  const lineas = useSyncExternalStore(suscribir, instantanea, instantaneaServidor);
  // false mientras React hidrata: evita mostrar "carrito vacío" por un frame.
  const listo = useSyncExternalStore(suscribir, siempreListo, nuncaListo);

  const agregar = useCallback((slug: string, talla: Talla, cantidad = 1) => {
    const producto = getProduct(slug);
    if (!producto || !producto.tallas.includes(talla)) return;
    const actual = instantanea();
    const i = actual.findIndex((l) => l.slug === slug && l.talla === talla);
    if (i === -1) {
      guardar([...actual, { slug, talla, cantidad }]);
      return;
    }
    const copia = [...actual];
    copia[i] = {
      ...copia[i],
      cantidad: Math.min(copia[i].cantidad + cantidad, MAX_POR_PIEZA),
    };
    guardar(copia);
  }, []);

  const cambiarCantidad = useCallback(
    (slug: string, talla: Talla, cantidad: number) => {
      const actual = instantanea();
      guardar(
        cantidad < 1
          ? actual.filter((l) => !(l.slug === slug && l.talla === talla))
          : actual.map((l) =>
              l.slug === slug && l.talla === talla
                ? { ...l, cantidad: Math.min(cantidad, MAX_POR_PIEZA) }
                : l,
            ),
      );
    },
    [],
  );

  const quitar = useCallback((slug: string, talla: Talla) => {
    guardar(instantanea().filter((l) => !(l.slug === slug && l.talla === talla)));
  }, []);

  const vaciar = useCallback(() => {
    if (instantanea().length > 0) guardar(VACIO);
  }, []);

  const resueltas = useMemo<ResolvedLine[]>(
    () =>
      lineas.flatMap((l): ResolvedLine[] => {
        const producto = getProduct(l.slug);
        // Sin precio confirmado no debería haber llegado al carrito (la UI de
        // compra lo impide), pero por seguridad de tipos no se le calcula total.
        if (!producto || producto.precio === undefined) return [];
        return [{ ...l, producto, subtotal: producto.precio * l.cantidad }];
      }),
    [lineas],
  );

  return {
    listo,
    lineas: resueltas,
    piezas: resueltas.reduce((n, l) => n + l.cantidad, 0),
    total: resueltas.reduce((n, l) => n + l.subtotal, 0),
    agregar,
    cambiarCantidad,
    quitar,
    vaciar,
  };
}
