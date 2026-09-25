import type { Metadata } from "next";
import Panel from "@/components/panel";
import FavoritosCliente from "@/components/favoritos-cliente";
import s from "./favoritos.module.css";

export const metadata: Metadata = {
  title: "Favoritos",
  description: "Los productos Versé que guardaste.",
  robots: { index: false, follow: false },
};

export default function Favoritos() {
  return (
    <Panel tono="seda" seam={false}>
      <div className="wrap">
        <header className={s.cabecera}>
          <h1 className={s.titulo}>Favoritos</h1>
          <span className="label muted">Versé Intimates</span>
        </header>
        <FavoritosCliente />
      </div>
    </Panel>
  );
}
