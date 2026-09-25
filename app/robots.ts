import type { MetadataRoute } from "next";
import { SITE } from "@/lib/sitio";
import { ACTIVO as PROVISIONAL } from "@/lib/provisional";

export default function robots(): MetadataRoute.Robots {
  // Mientras haya fotos provisionales, nada se indexa (ver lib/provisional.ts).
  if (PROVISIONAL) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Páginas personales o de proceso: no aportan nada en un buscador.
      disallow: ["/api/", "/carrito", "/favoritos", "/pedido", "/laboratorio"],
    },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
