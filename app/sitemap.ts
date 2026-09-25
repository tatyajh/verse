import type { MetadataRoute } from "next";
import { SITE } from "@/lib/sitio";
import { COLECCIONES } from "@/lib/colecciones";
import { PRODUCTS } from "@/lib/products";
import { ENTRADAS } from "@/lib/blog";
import { DOCUMENTOS } from "@/lib/legal";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (ruta: string) => `${SITE}${ruta}`;

  return [
    { url: url("/"), changeFrequency: "weekly", priority: 1 },
    { url: url("/colecciones"), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/piezas"), changeFrequency: "weekly", priority: 0.9 },
    ...COLECCIONES.map((c) => ({
      url: url(c.ruta),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...PRODUCTS.map((p) => ({
      url: url(`/producto/${p.slug}`),
      changeFrequency: "monthly" as const,
      priority: p.componenteDe ? 0.5 : 0.7,
    })),
    { url: url("/blog"), changeFrequency: "weekly", priority: 0.6 },
    ...ENTRADAS.map((e) => ({
      url: url(`/blog/${e.slug}`),
      lastModified: e.fecha,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    ...DOCUMENTOS.map((d) => ({
      url: url(`/legal/${d.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}
