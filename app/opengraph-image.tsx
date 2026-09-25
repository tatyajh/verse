import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Versé Intimates, ropa interior y lencería diseñadas en Medellín";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function svg(nombre: string, trazo?: string): Promise<string> {
  let fuente = await readFile(join(process.cwd(), "public", nombre), "utf8");
  // El wordmark viene en bronce oscuro; sobre noche se pinta en oro rosa.
  if (trazo) fuente = fuente.replaceAll("#6e5140", trazo);
  return `data:image/svg+xml;base64,${Buffer.from(fuente).toString("base64")}`;
}

/** Imagen que aparece al compartir cualquier página del sitio. */
export default async function Image() {
  const [emblema, palabra] = await Promise.all([
    svg("verse-mark.svg"),
    svg("verse-wordmark.svg", "#DEA193"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 64,
          background: "#060608",
        }}
      >
        <img src={emblema} width={176} height={398} alt="" />
        <img src={palabra} width={560} height={180} alt="" />
      </div>
    ),
    size,
  );
}
