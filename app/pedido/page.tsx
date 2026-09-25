import type { Metadata } from "next";
import Link from "next/link";
import Panel from "@/components/panel";
import LimpiarCarrito from "@/components/limpiar-carrito";
import { formatCOP } from "@/lib/money";
import { consultarTransaccion, type TransaccionWompi } from "@/lib/wompi";
import s from "./pedido.module.css";

export const metadata: Metadata = {
  title: "Tu pedido",
  robots: { index: false, follow: false },
};

const COPY: Record<string, { titulo: string; texto: string }> = {
  APPROVED: {
    titulo: "Pedido confirmado.",
    texto:
      "Recibimos tu pago. Te escribimos al correo con el detalle y el número de guía cuando la caja salga. Llega en 2 a 5 días hábiles.",
  },
  PENDING: {
    titulo: "Tu pago está en proceso.",
    texto:
      "Algunos medios, como PSE, tardan unos minutos en confirmar. Te avisamos por correo apenas el banco responda.",
  },
  DECLINED: {
    titulo: "El pago no se completó.",
    texto:
      "El banco rechazó la transacción y no se hizo ningún cobro. Tus productos siguen en el carrito por si quieres intentar con otro medio.",
  },
  VOIDED: {
    titulo: "El pago fue anulado.",
    texto: "No se hizo ningún cobro. Puedes volver a intentarlo cuando quieras.",
  },
  ERROR: {
    titulo: "Algo falló durante el pago.",
    texto:
      "No se completó el cobro. Si ves un descuento en tu cuenta, escríbenos con la referencia y lo revisamos contigo.",
  },
};

function Estado({ transaccion }: { transaccion: TransaccionWompi }) {
  const copy = COPY[transaccion.status] ?? COPY.ERROR;
  return (
    <>
      {transaccion.status === "APPROVED" && <LimpiarCarrito />}
      <p className="label muted">Referencia {transaccion.reference}</p>
      <h1 className={s.titulo}>{copy.titulo}</h1>
      <p>{copy.texto}</p>

      <div className={`${s.ficha} label num`}>
        <p className={s.dato}>
          <span>Total</span>
          <span>{formatCOP(Math.round(transaccion.amount_in_cents / 100))}</span>
        </p>
        <p className={s.dato}>
          <span>Medio de pago</span>
          <span>{transaccion.payment_method_type ?? "—"}</span>
        </p>
        <p className={s.dato}>
          <span>Estado</span>
          <span>{transaccion.status}</span>
        </p>
      </div>
    </>
  );
}

export default async function Pedido(props: PageProps<"/pedido">) {
  const query = await props.searchParams;
  const crudo = Array.isArray(query.id) ? query.id[0] : query.id;

  let transaccion: TransaccionWompi | null = null;
  let fallo = false;

  if (crudo) {
    try {
      // Wompi ya no permite consultar transacciones desde el navegador:
      // esta llamada sale del servidor, con la llave privada.
      transaccion = await consultarTransaccion(crudo);
    } catch {
      fallo = true;
    }
  }

  return (
    <Panel tono="noche" seam={false}>
      <div className="wrap">
        <div className={s.pedido}>
          {transaccion ? (
            <Estado transaccion={transaccion} />
          ) : (
            <>
              <p className="label muted">Pedido</p>
              <h1 className={s.titulo}>
                {fallo ? "No pudimos consultar tu pago." : "No encontramos ese pedido."}
              </h1>
              <p>
                {fallo
                  ? "La pasarela no respondió. Si ya pagaste, tu pedido está registrado: escríbenos con la referencia y te confirmamos."
                  : "Puede que el enlace esté incompleto. Si acabas de pagar, revisa el correo de confirmación o escríbenos y lo buscamos."}
              </p>
            </>
          )}

          <div className={s.acciones}>
            <Link href="/productos" className="btn btn-fg">
              Ver los productos
            </Link>
            <a href="mailto:hola@verseintimates.com" className="btn">
              Escribirnos
            </a>
          </div>
        </div>
      </div>
    </Panel>
  );
}
