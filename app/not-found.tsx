import Link from "next/link";
import Panel from "@/components/panel";
import s from "./not-found.module.css";

export default function NotFound() {
  return (
    <Panel tono="noche" seam={false}>
      <div className="wrap">
        <div className={s.contenedor}>
          <h1 className={s.titulo}>Esta página no existe</h1>
          <p className={s.descripcion}>
            Puede que el enlace esté incompleto o que la pieza ya no esté
            disponible.
          </p>
          <div className={s.acciones}>
            <Link href="/piezas" className="btn btn-fg">
              Ver las piezas
            </Link>
            <Link href="/" className="label link">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </Panel>
  );
}
