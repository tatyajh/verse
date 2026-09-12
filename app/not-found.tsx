import Link from "next/link";
import Panel from "@/components/panel";
import s from "./not-found.module.css";

export default function NotFound() {
  return (
    <Panel tono="noche" seam={false}>
      <div className="wrap">
        <div className={s.contenedor}>
          <div className={s.codigo}>404</div>
          <h1 className={s.titulo}>Página no encontrada</h1>
          <p className={s.descripcion}>
            La página que buscas no existe o ha sido movida a otro lugar.
          </p>
          <Link href="/" className="btn btn-fg">
            Volver al inicio
          </Link>
        </div>
      </div>
    </Panel>
  );
}
