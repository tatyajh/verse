import Link from "next/link";
import { VerseMark } from "./verse-mark";
import Panel from "./panel";
import { LINEAS } from "@/lib/products";
import s from "./footer.module.css";

/** El sitio abre con la caja y cierra en noche: vuelve a cerrarse. */
export default function Footer() {
  return (
    <Panel tono="noche" padded={false} className={s.pie}>
      <div className="wrap">
        <div className={s.rejilla}>
          <div className={s.marca}>
            <VerseMark size={52} />
            <p className={s.nombre}>VERSÉ</p>
            <p className={s.frase}>
              De lo cotidiano a lo especial, lencería para acompañar las distintas formas
              en las que decides sentirte tú misma.
            </p>
          </div>

          <div className={s.col}>
            <h3 className="label">Colecciones</h3>
            <ul>
              <li>
                <Link href="/aurora" className="link">
                  Aurora
                </Link>
              </li>
              {LINEAS.map((l) => (
                <li key={l.id}>
                  <Link href={`/coleccion?linea=${l.id}`} className="link">
                    {l.nombre}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/coleccion" className="link">
                  Colección completa
                </Link>
              </li>
            </ul>
          </div>

          <div className={s.col}>
            <h3 className="label">La casa</h3>
            <ul>
              <li>
                <Link href="/#manifiesto" className="link">
                  La marca
                </Link>
              </li>
              <li>
                <Link href="/#llave" className="link">
                  La llave
                </Link>
              </li>
              <li>
                <Link href="/#tallas" className="link">
                  Guía de tallas
                </Link>
              </li>
            </ul>
          </div>

          <div className={s.col}>
            <h3 className="label">Escríbenos</h3>
            <ul>
              <li>
                <a href="mailto:hola@verseintimates.com" className="link">
                  hola@verseintimates.com
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/verse_intimates"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={`${s.legal} label`}>
          <span>© {new Date().getFullYear()} Versé Intimates</span>
          <span>Medellín, Colombia</span>
        </div>
      </div>
    </Panel>
  );
}
