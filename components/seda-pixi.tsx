"use client";

import { useEffect, useRef } from "react";
import { createNoise4D } from "simplex-noise";
import cargadorImagen from "@/lib/cargador-imagen";
import { prng, semilla } from "@/lib/azar";
import s from "./seda-pixi.module.css";

/**
 * La foto del hero dibujada con PixiJS y un filtro de desplazamiento: la
 * imagen ondula como seda cuando el cursor se mueve encima y se aquieta
 * cuando se detiene.
 *
 * Pixi se importa solo aquí y de forma diferida, para no cargarlo en el resto
 * del sitio. Si no hay WebGL o algo falla, se queda la <Image> de siempre
 * (quien llama la oculta solo cuando `onListo` confirma que el lienzo pintó).
 */
export default function SedaPixi({
  foto,
  onListo,
}: {
  foto: string;
  onListo: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let vivo = true;
    let limpiar = () => {};

    (async () => {
      const PIXI = await import("pixi.js");
      if (!vivo) return;

      const app = new PIXI.Application();
      try {
        await app.init({
          resizeTo: el,
          backgroundAlpha: 0,
          antialias: true,
          autoDensity: true,
          resolution: Math.min(window.devicePixelRatio || 1, 2),
          preference: "webgl",
        });
      } catch {
        return; // sin WebGL: se queda la foto normal
      }
      if (!vivo) {
        app.destroy(true);
        return;
      }

      // onload y no decode(): decode() puede quedarse esperando en una
      // pestaña abierta en segundo plano.
      const imagen = new Image();
      imagen.crossOrigin = "anonymous";
      const cargada = new Promise<void>((ok, falla) => {
        imagen.onload = () => ok();
        imagen.onerror = () => falla(new Error("foto"));
      });
      imagen.src = cargadorImagen({ src: foto, width: 1400, quality: 80 });
      try {
        await cargada;
      } catch {
        app.destroy(true);
        return;
      }
      if (!vivo) {
        app.destroy(true);
        return;
      }

      const foto2d = new PIXI.Sprite(PIXI.Texture.from(imagen));
      const mapa = new PIXI.Sprite(PIXI.Texture.from(mapaDeSeda(256)));
      mapa.texture.source.addressMode = "repeat";
      mapa.scale.set(2.2);
      mapa.renderable = false; // solo alimenta el filtro

      const filtro = new PIXI.DisplacementFilter({ sprite: mapa, scale: 0 });
      foto2d.filters = [filtro];
      app.stage.addChild(mapa, foto2d);

      // La foto cubre el marco como object-fit: cover.
      const encuadrar = () => {
        const { width, height } = app.screen;
        const k = Math.max(width / imagen.naturalWidth, height / imagen.naturalHeight) * 1.04;
        foto2d.scale.set(k);
        foto2d.position.set(
          (width - imagen.naturalWidth * k) / 2,
          (height - imagen.naturalHeight * k) / 2,
        );
      };
      encuadrar();
      app.renderer.on("resize", encuadrar);

      // Movimiento del cursor -> intensidad de la ondulación.
      let objetivo = 0;
      let intensidad = 0;
      let ultimo: { x: number; y: number } | null = null;
      const mover = (e: PointerEvent) => {
        if (ultimo) {
          const v = Math.hypot(e.clientX - ultimo.x, e.clientY - ultimo.y);
          objetivo = Math.min(38, objetivo + v * 0.9);
        }
        ultimo = { x: e.clientX, y: e.clientY };
      };
      const salir = () => {
        ultimo = null;
      };
      const figura = el.parentElement ?? el;
      figura.addEventListener("pointermove", mover);
      figura.addEventListener("pointerleave", salir);

      app.ticker.add((t) => {
        // Una respiración mínima siempre; el cursor la agita y se calma sola.
        objetivo *= 0.94;
        intensidad += (Math.max(5, objetivo) - intensidad) * 0.08;
        filtro.scale.x = intensidad;
        filtro.scale.y = intensidad * 0.7;
        mapa.x -= 0.35 * t.deltaTime;
        mapa.y -= 0.18 * t.deltaTime;
      });

      // Fuera de pantalla no se dibuja.
      const io = new IntersectionObserver(([entrada]) => {
        if (entrada.isIntersecting) app.ticker.start();
        else app.ticker.stop();
      });
      io.observe(el);

      el.appendChild(app.canvas);
      onListo();

      limpiar = () => {
        io.disconnect();
        figura.removeEventListener("pointermove", mover);
        figura.removeEventListener("pointerleave", salir);
        app.destroy(true, { children: true, texture: true });
      };
    })();

    return () => {
      vivo = false;
      limpiar();
    };
  }, [foto, onListo]);

  return <div ref={ref} className={s.lienzo} aria-hidden="true" />;
}

/**
 * Mapa de desplazamiento que se repite sin costuras: ruido 4D recorrido
 * sobre un toro. Rojo mueve en horizontal, verde en vertical; las ondas son
 * largas y suaves, como una tela que se mueve con el aire.
 */
function mapaDeSeda(lado: number): HTMLCanvasElement {
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
