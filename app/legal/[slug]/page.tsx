import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Panel from "@/components/panel";
import { DOCUMENTOS, getDocumento } from "@/lib/legal";
import { formatFecha } from "@/lib/blog";
import s from "./legal.module.css";

export function generateStaticParams() {
  return DOCUMENTOS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(
  props: PageProps<"/legal/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const doc = getDocumento(slug);
  if (!doc) return { title: "Documento no encontrado" };
  return { title: doc.titulo, description: doc.resumen };
}

export default async function Legal(props: PageProps<"/legal/[slug]">) {
  const { slug } = await props.params;
  const doc = getDocumento(slug);
  if (!doc) notFound();

  const otros = DOCUMENTOS.filter((d) => d.slug !== doc.slug);

  return (
    <Panel tono="seda" seam={false}>
      <div className="wrap">
        <article className={s.documento}>
          <header className={s.cabecera}>
            <h1 className={s.titulo}>{doc.titulo}</h1>
            <p className={s.resumen}>{doc.resumen}</p>
            <p className={`${s.fecha} label num`}>
              Actualizado el <time dateTime={doc.actualizado}>{formatFecha(doc.actualizado)}</time>
            </p>
          </header>

          <div className={s.cuerpo}>
            {doc.cuerpo.map((b, i) =>
              b.tipo === "subtitulo" ? (
                <h2 key={i} className={s.subtitulo}>
                  {b.texto}
                </h2>
              ) : (
                <p key={i}>{b.texto}</p>
              ),
            )}
          </div>

          <nav className={`${s.otros} label`} aria-label="Otros documentos">
            {otros.map((d) => (
              <Link key={d.slug} href={`/legal/${d.slug}`} className="link">
                {d.titulo}
              </Link>
            ))}
          </nav>
        </article>
      </div>
    </Panel>
  );
}
