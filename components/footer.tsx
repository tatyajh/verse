import Link from "next/link";
import { VerseMark } from "./verse-mark";
import Panel from "./panel";
import { COLECCIONES } from "@/lib/colecciones";
import { DOCUMENTOS } from "@/lib/legal";
import { enlaceWhatsApp } from "@/lib/contacto";
import s from "./footer.module.css";

/** Pie en panel noche, igual que la apertura. */
export default function Footer() {
  const whatsapp = enlaceWhatsApp("Hola Versé, quiero preguntarles algo.");

  return (
    <Panel tono="noche" padded={false} className={s.pie}>
      <div className="wrap">
        <div className={s.rejilla}>
          <div className={s.marca}>
            <VerseMark size={52} />
            <p className={s.nombre}>VERSÉ</p>
            <p className={s.frase}>
              Lencería diseñada en Medellín. Enviamos a toda Colombia.
            </p>
          </div>

          <div className={s.col}>
            <h3 className="label">Colecciones</h3>
            <ul>
              {COLECCIONES.map((c) => (
                <li key={c.id}>
                  <Link href={c.piezas} className="link">
                    {c.nombre}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/colecciones" className="link">
                  Ver todas
                </Link>
              </li>
            </ul>
          </div>

          <div className={s.col}>
            <h3 className="label">Versé</h3>
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
              <li>
                <Link href="/blog" className="link">
                  Diario
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
              {whatsapp && (
                <li>
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="link">
                    WhatsApp
                  </a>
                </li>
              )}
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
          <span>© {new Date().getFullYear()} Versé Intimates, Medellín</span>
          <nav className={s.legales} aria-label="Legal">
            {DOCUMENTOS.map((d) => (
              <Link key={d.slug} href={`/legal/${d.slug}`} className="link">
                {d.titulo}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </Panel>
  );
}
