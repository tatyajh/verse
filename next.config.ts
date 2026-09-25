import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Ver lib/cargador-imagen.ts: Unsplash redimensiona por su cuenta.
    loader: "custom",
    loaderFile: "./lib/cargador-imagen.ts",
  },
  // Con una sola colección, el índice de colecciones y el catálogo eran lo
  // mismo: /piezas ya filtra por colección cuando haya más de una.
  async redirects() {
    return [{ source: "/colecciones", destination: "/piezas", permanent: false }];
  },
};

export default nextConfig;
