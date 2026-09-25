import type { MetadataRoute } from "next";
import { SITE } from "@/lib/sitio";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Páginas personales o de proceso: no aportan nada en un buscador.
      disallow: ["/api/", "/carrito", "/favoritos", "/pedido"],
    },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
