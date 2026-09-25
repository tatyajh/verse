"use client";

import { useEffect, useRef, useState } from "react";
import { useMedia } from "@/lib/media";
import { mapaDeSeda } from "@/lib/mapa-seda";
import s from "./llave-viva.module.css";

/**
 * La llave del logo, grande, en el hero. Con PixiJS: sigue un poco al cursor
 * o al dedo, se inclina y ondula como seda mientras se mueve, y vuelve sola a
 * su sitio. Es el mismo efecto de la tela, sobre el símbolo de la marca.
 *
 * El archivo es el logo sin la cápsula (verse-llave.svg), nunca redibujado.
 * Sin WebGL o con movimiento reducido queda la llave quieta.
 */
export default function LlaveViva() {
  const ref = useRef<HTMLDivElement>(null);
  const reducido = useMedia("(prefers-reduced-motion: reduce)");
  const [lista, setLista] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducido) return;
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
        return;
      }
      if (!vivo) {
        app.destroy(true);
        return;
      }

      // El SVG se rasteriza grande para que no se vea borroso al ondular.
      const svg = new Image();
      const cargada = new Promise<void>((ok, falla) => {
        svg.onload = () => ok();
        svg.onerror = () => falla(new Error("llave"));
      });
      svg.src = "/verse-llave.svg";
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
      const escala = 4;
      const lienzo = document.createElement("canvas");
      lienzo.width = 235 * escala;
      lienzo.height = 775 * escala;
      lienzo.getContext("2d")!.drawImage(svg, 0, 0, lienzo.width, lienzo.height);

      const llave = new PIXI.Sprite(PIXI.Texture.from(lienzo));
      llave.anchor.set(0.5);
      const mapa = new PIXI.Sprite(PIXI.Texture.from(mapaDeSeda(256)));
      mapa.texture.source.addressMode = "repeat";
      mapa.scale.set(1.6);
      mapa.renderable = false;
      const filtro = new PIXI.DisplacementFilter({ sprite: mapa, scale: 0 });
      filtro.padding = 60;
      llave.filters = [filtro];
      app.stage.addChild(mapa, llave);

      const encuadrar = () => {
        const { width, height } = app.screen;
        const k = Math.min((height * 0.92) / lienzo.height, (width * 0.9) / lienzo.width);
        llave.scale.set(k);
      };
      encuadrar();
      app.renderer.on("resize", encuadrar);

      // Puntero: hacia dónde se va la llave y cuánto se agita.
      let objetivoX = 0;
      let objetivoY = 0;
      let x = 0;
      let y = 0;
      let agitacion = 0;
      let ultimo: { x: number; y: number } | null = null;
      const mover = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        objetivoX = (e.clientX - r.left - r.width / 2) * 0.22;
        objetivoY = (e.clientY - r.top - r.height / 2) * 0.12;
        if (ultimo) {
          agitacion = Math.min(46, agitacion + Math.hypot(e.clientX - ultimo.x, e.clientY - ultimo.y) * 1.1);
        }
        ultimo = { x: e.clientX, y: e.clientY };
      };
      const soltar = () => {
        objetivoX = 0;
        objetivoY = 0;
        ultimo = null;
      };
      el.addEventListener("pointermove", mover);
      el.addEventListener("pointerdown", mover);
      el.addEventListener("pointerleave", soltar);
      el.addEventListener("pointerup", soltar);
      el.addEventListener("pointercancel", soltar);

      let t = 0;
      app.ticker.add((tick) => {
        t += 0.01 * tick.deltaTime;
        // Resorte hacia el objetivo y un vaivén mínimo, como colgada.
        x += (objetivoX - x) * 0.08;
        y += (objetivoY - y) * 0.08;
        const { width, height } = app.screen;
        llave.position.set(width / 2 + x, height / 2 + y + Math.sin(t) * 4);
        llave.rotation = x * 0.0022 + Math.sin(t * 0.8) * 0.012;
        agitacion *= 0.93;
        filtro.scale.x = 4 + agitacion;
        filtro.scale.y = (4 + agitacion) * 0.6;
        mapa.x -= 0.4 * tick.deltaTime;
        mapa.y -= 0.2 * tick.deltaTime;
      });

      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) app.ticker.start();
        else app.ticker.stop();
      });
      io.observe(el);

      app.canvas.style.pointerEvents = "none";
      el.appendChild(app.canvas);
      setLista(true);

      limpiar = () => {
        io.disconnect();
        el.removeEventListener("pointermove", mover);
        el.removeEventListener("pointerdown", mover);
        el.removeEventListener("pointerleave", soltar);
        el.removeEventListener("pointerup", soltar);
        el.removeEventListener("pointercancel", soltar);
        app.destroy(true, { children: true, texture: true });
      };
    })();

    return () => {
      vivo = false;
      limpiar();
    };
  }, [reducido]);

  return (
    <div ref={ref} className={s.llave}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/verse-llave.svg"
        alt="La llave de Versé"
        className={`${s.quieta} ${lista ? s.oculta : ""}`}
      />
    </div>
  );
}
