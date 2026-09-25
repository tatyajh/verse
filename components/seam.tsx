import Hilo from "./firmas/hilo";
import s from "./panel.module.css";

/** Entre un panel y el siguiente, un hilo que cuelga en lugar de una línea recta. */
export default function Seam() {
  return (
    <div className={s.seam} aria-hidden="true">
      <Hilo caida={7} alto={36} />
    </div>
  );
}
