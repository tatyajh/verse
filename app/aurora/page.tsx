import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/product-card";
import {
  auroraPorTonalidad,
  getTonalidad,
  TIPO_LABEL,
  TONALIDADES,
  type Tonalidad,
  type TipoPieza,
} from "@/lib/products";
import s from "./aurora.module.css";

export const metadata: Metadata = {
  title: "Aurora",
  description:
    "Veinte piezas, dos tonalidades. La colección Aurora, de Versé Intimates.",
};

function esTonalidad(valor: string | undefined): valor is Tonalidad {
  return TONALIDADES.some((t) => t.id === valor);
}

const ORDEN_TIPO: TipoPieza[] = ["conjunto", "body", "complemento"];

export default async function Aurora(props: PageProps<"/aurora">) {
  const query = await props.searchParams;
  const crudo = Array.isArray(query.tonalidad) ? query.tonalidad[0] : query.tonalidad;
  const activa: Tonalidad = esTonalidad(crudo) ? crudo : "nocturna";

  const tonalidad = getTonalidad(activa);
  const piezas = auroraPorTonalidad(activa);

  return (
    // data-panel: solo para que <Nav/> sepa de qué color pintarse encima
    // (el color real lo definen los tokens propios de .pagina, no este atributo).
    <section
      className={s.pagina}
      data-panel={activa === "diurna" ? "seda" : "noche"}
      data-tonalidad={activa}
    >
      <div className="wrap">
        <header className={s.cabecera}>
          <p className={`${s.eyebrow} label`}>Colección</p>
          <h1 className={s.titulo}>Aurora</h1>
          <p className={s.intro}>
            Veinte piezas, dos tonalidades. La misma casa, dos maneras de sentirla.
          </p>
        </header>

        <nav className={s.toggle} aria-label="Tonalidad">
          {TONALIDADES.map((t) => (
            <Link
              key={t.id}
              href={`/aurora?tonalidad=${t.id}`}
              className={t.id === activa ? s.toggleActivo : ""}
              scroll={false}
            >
              {t.nombre}
            </Link>
          ))}
        </nav>

        <div className={s.mood}>
          <p className={s.sensacion}>{tonalidad.sensacion}.</p>
          <div className={s.swatches} aria-hidden="true">
            {tonalidad.paleta.map((c) => (
              <span key={c.hex} className={s.swatch} style={{ background: c.hex }} />
            ))}
          </div>
        </div>

        {ORDEN_TIPO.map((tipo) => {
          const delGrupo = piezas.filter((p) => p.tipo === tipo);
          if (delGrupo.length === 0) return null;
          return (
            <div key={tipo} className={s.grupo}>
              <div className={`${s.grupoCinta} label`}>
                <h2 className={s.grupoTitulo}>{TIPO_LABEL[tipo]}s</h2>
                <span>{delGrupo.length}</span>
              </div>
              <div className={s.rejilla}>
                {delGrupo.map((p) => (
                  <ProductCard
                    key={p.slug}
                    producto={p}
                    sizes="(max-width: 560px) 100vw, (max-width: 860px) 50vw, 33vw"
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
