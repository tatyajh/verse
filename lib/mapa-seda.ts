import { createNoise4D } from "simplex-noise";
import { prng, semilla } from "./azar";

/**
 * Mapa de desplazamiento que se repite sin costuras: ruido 4D recorrido
 * sobre un toro. Rojo mueve en horizontal, verde en vertical; las ondas son
 * largas y suaves, como una tela que se mueve con el aire.
 */
export function mapaDeSeda(lado: number): HTMLCanvasElement {
  const lienzo = document.createElement("canvas");
  lienzo.width = lienzo.height = lado;
  const ctx = lienzo.getContext("2d")!;
  const datos = ctx.createImageData(lado, lado);
  const ruido = createNoise4D(prng(semilla("seda")));
  const r = 0.9;

  for (let y = 0; y < lado; y++) {
    for (let x = 0; x < lado; x++) {
      const a = (x / lado) * Math.PI * 2;
      const b = (y / lado) * Math.PI * 2;
      const nx = Math.cos(a) * r;
      const ny = Math.sin(a) * r;
      const nz = Math.cos(b) * r;
      const nw = Math.sin(b) * r;
      const i = (y * lado + x) * 4;
      datos.data[i] = 128 + 127 * ruido(nx, ny, nz, nw);
      datos.data[i + 1] = 128 + 127 * ruido(nx + 3.1, ny, nz, nw + 1.7);
      datos.data[i + 2] = 128;
      datos.data[i + 3] = 255;
    }
  }
  ctx.putImageData(datos, 0, 0);
  return lienzo;
}
