import s from "./panel.module.css";

/** Filete de 1px en el borde superior de un panel. */
export default function Seam() {
  return <div className={s.seam} aria-hidden="true" />;
}
