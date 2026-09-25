import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Ver lib/cargador-imagen.ts: Unsplash redimensiona por su cuenta.
    loader: "custom",
    loaderFile: "./lib/cargador-imagen.ts",
  },
  // /productos es el catálogo completo y filtra por colección cuando haya más
  // de una; las direcciones anteriores llevan ahí.
  async redirects() {
    return [
      { source: "/colecciones", destination: "/productos", permanent: false },
      { source: "/piezas", destination: "/productos", permanent: true },
    ];
  },
};

export default nextConfig;
