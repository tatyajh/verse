import Seam from "./seam";
import s from "./panel.module.css";

/**
 * Panel a sangre completa. `tono` reasigna los tokens semánticos, así que
 * todo lo que vive dentro se escribe una sola vez y funciona en ambos mundos.
 */
export default function Panel({
  tono,
  id,
  seam = true,
  padded = true,
  className,
  children,
}: {
  tono: "noche" | "seda";
  id?: string;
  seam?: boolean;
  padded?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const clases = [s.panel, padded ? s.padded : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <section id={id} data-panel={tono} className={clases}>
      {seam && <Seam />}
      {children}
    </section>
  );
}
