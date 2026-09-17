import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Panel from "@/components/panel";
import BotonWhatsApp from "@/components/boton-whatsapp";
import { ENTRADAS, getEntrada, formatFecha } from "@/lib/blog";
import s from "./entrada.module.css";

export function generateStaticParams() {
  return ENTRADAS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const entrada = getEntrada(slug);
  if (!entrada) return { title: "Entrada no encontrada" };
  return {
    title: entrada.titulo,
    description: entrada.resumen,
    openGraph: {
      title: `${entrada.titulo} — Versé`,
      description: entrada.resumen,
      type: "article",
      publishedTime: entrada.fecha,
    },
  };
}

export default async function EntradaBlog(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const entrada = getEntrada(slug);
  if (!entrada) notFound();

  const otras = ENTRADAS.filter((e) => e.slug !== entrada.slug).slice(0, 2);

  return (
    <Panel tono="seda" seam={false}>
      <div className="wrap">
        <article className={s.entrada}>
          <nav className={`${s.migas} label`} aria-label="Ruta">
            <Link href="/blog" className="link">
              Diario
            </Link>
          </nav>

          <header className={s.cabecera}>
            <time className={`${s.fecha} label num`} dateTime={entrada.fecha}>
              {formatFecha(entrada.fecha)}
            </time>
            <h1 className={s.titulo}>{entrada.titulo}</h1>
            <p className={s.resumen}>{entrada.resumen}</p>
          </header>

          <div className={s.cuerpo}>
            {entrada.cuerpo.map((b, i) => {
              if (b.tipo === "subtitulo") {
                return (
                  <h2 key={i} className={s.subtitulo}>
                    {b.texto}
                  </h2>
                );
              }
              if (b.tipo === "cita") {
                return (
                  <p key={i} className={s.cita}>
                    {b.texto}
                  </p>
                );
              }
              return <p key={i}>{b.texto}</p>;
            })}
          </div>

          <footer className={s.cierre}>
            <BotonWhatsApp
              mensaje={`Hola Versé, leí "${entrada.titulo}" en el diario y quiero preguntarles algo.`}
            />
          </footer>
        </article>

        {otras.length > 0 && (
          <section className={s.otras}>
            <h2 className={`${s.otrasCinta} label`}>Sigue leyendo</h2>
            <ul className={s.otrasLista}>
              {otras.map((e) => (
                <li key={e.slug}>
                  <Link href={`/blog/${e.slug}`} className={s.otraEnlace}>
                    <span className={s.otraTitulo}>{e.titulo}</span>
                    <span className={s.otraResumen}>{e.resumen}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </Panel>
  );
}
