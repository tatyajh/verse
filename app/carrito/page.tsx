import type { Metadata } from "next";
import Panel from "@/components/panel";
import CarritoCliente from "@/components/carrito-cliente";
import s from "./carrito.module.css";

export const metadata: Metadata = {
  title: "Carrito",
  description: "Tus piezas Versé antes de pagar.",
  robots: { index: false, follow: false },
};

export default function Carrito() {
  return (
    <Panel tono="seda" seam={false}>
      <div className="wrap">
        <header className={s.cabecera}>
          <h1 className={s.titulo}>Carrito</h1>
          <span className="label muted">Versé Intimates</span>
        </header>
        <CarritoCliente />
      </div>
    </Panel>
  );
}
