import type { Metadata } from "next";
import Link from "next/link";
import Panel from "@/components/panel";
import { COLECCIONES } from "@/lib/colecciones";
import { porColeccion } from "@/lib/products";
import s from "./colecciones.module.css";

export const metadata: Metadata = {
  title: "Colecciones",
  description: "Las colecciones de Versé Intimates, lencería diseñada en Medellín.",
};

export default function Colecciones() {
  return (
    <Panel tono="seda" seam={false}>
      <div className="wrap">
        <header className={s.cabecera}>
          <h1 className={s.titulo}>Colecciones</h1>
        </header>

        <ul className={s.lista}>
          {COLECCIONES.map((c, i) => {
            // Las prendas sueltas de un conjunto no cuentan como pieza aparte.
            const piezas = porColeccion(c.id).filter((p) => !p.componenteDe).length;
            return (
              <li key={c.id} className={s.fila}>
                <p className={`${s.numero} label num`}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div className={s.cuerpo}>
                  <h2 className={s.nombre}>{c.nombre}</h2>
                  <p className={s.descripcion}>{c.descripcion}</p>
                  <p className={`${s.dato} label num`}>{piezas} piezas</p>
                  <div className={s.acciones}>
                    <Link href={c.piezas} className="btn btn-fg">
                      Ver piezas
                    </Link>
                    {c.ruta !== c.piezas && (
                      <Link href={c.ruta} className="label link">
                        La historia
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Panel>
  );
}
