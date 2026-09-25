import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Ver lib/cargador-imagen.ts: Unsplash redimensiona por su cuenta.
    loader: "custom",
    loaderFile: "./lib/cargador-imagen.ts",
  },
};

export default nextConfig;
