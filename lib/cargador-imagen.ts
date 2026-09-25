"use client";

/**
 * Cargador de next/image. Las fotos de Unsplash (provisionales) se piden ya
 * redimensionadas a su CDN, que acepta ancho y calidad por parámetro; así el
 * servidor no tiene que descargarlas. Las fotos propias en /public se sirven
 * tal cual.
 */
export default function cargadorImagen({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (src.startsWith("https://images.unsplash.com/")) {
    return `${src}?w=${width}&q=${quality ?? 75}&auto=format&fit=crop`;
  }
  return src;
}
