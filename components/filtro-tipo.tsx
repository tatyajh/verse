import Link from "next/link";
import { TIPOS_FILTRO } from "@/lib/catalogo";
import { TIPO_PLURAL, type TipoPieza } from "@/lib/products";
import s from "./filtro-tipo.module.css";

/** Filtro por tipo de prenda. `base` es la URL sin el parámetro `tipo`. */
export default function FiltroTipo({
  base,
  activo,
}: {
  base: string;
  activo: TipoPieza | null;
}) {
  const sep = base.includes("?") ? "&" : "?";
  return (
    <nav className={`${s.filtros} label`} aria-label="Tipo de prenda">
      <Link href={base} className={!activo ? s.activo : ""} scroll={false}>
        Todo
      </Link>
      {TIPOS_FILTRO.map((tipo) => (
        <Link
          key={tipo}
          href={`${base}${sep}tipo=${tipo}`}
          className={activo === tipo ? s.activo : ""}
          scroll={false}
        >
          {TIPO_PLURAL[tipo]}
        </Link>
      ))}
    </nav>
  );
}
