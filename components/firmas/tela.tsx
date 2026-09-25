"use client";

import Image from "next/image";
import { useCallback, useState, type ReactNode } from "react";
import SedaPixi from "@/components/seda-pixi";
import { useMedia } from "@/lib/media";
import s from "./tela.module.css";

/** Una superficie de seda que ondula bajo el cursor (PixiJS), con texto encima. */
export default function Tela({ foto, children }: { foto: string; children?: ReactNode }) {
  const reducido = useMedia("(prefers-reduced-motion: reduce)");
  const [lista, setLista] = useState(false);
  const alListo = useCallback(() => setLista(true), []);

  return (
    <div className={s.tela}>
      <Image src={foto} alt="" fill sizes="100vw" className={`${s.foto} ${lista ? s.oculta : ""}`} />
      {!reducido && <SedaPixi foto={foto} onListo={alListo} />}
      <div className={s.encima}>{children}</div>
    </div>
  );
}
