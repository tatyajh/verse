"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import s from "./lista-privada.module.css";

type Estado = "quieto" | "enviando" | "listo" | "error";

/**
 * Inscripción a la lista privada. Sin `pieza`, es para la primera edición;
 * con `pieza`, avisa cuando esa pieza salga.
 */
export default function ListaPrivada({
  pieza,
  boton = "Pedir acceso",
  className,
}: {
  pieza?: string;
  boton?: string;
  className?: string;
}) {
  const id = useId();
  const [estado, setEstado] = useState<Estado>("quieto");
  const [mensaje, setMensaje] = useState("");

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    setEstado("enviando");
    setMensaje("");
    try {
      const r = await fetch("/api/lista", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: datos.get("correo"),
          web: datos.get("web"),
          pieza,
        }),
      });
      const cuerpo = await r.json().catch(() => null);
      if (!r.ok) throw new Error(cuerpo?.error ?? "No pudimos guardar tu correo. Intenta de nuevo.");
      setEstado("listo");
    } catch (error) {
      setEstado("error");
      setMensaje(error instanceof Error ? error.message : "No pudimos guardar tu correo.");
    }
  };

  if (estado === "listo") {
    return (
      <p className={`${s.listo} ${className ?? ""}`} role="status">
        {pieza
          ? "Listo. Te escribimos cuando esta pieza salga."
          : "Listo. Te escribimos antes de abrir la primera edición."}
      </p>
    );
  }

  return (
    <form className={`${s.form} ${className ?? ""}`} onSubmit={enviar} noValidate>
      <div className={s.fila}>
        <label htmlFor={`${id}-correo`} className="sr-only">
          Tu correo
        </label>
        <input
          id={`${id}-correo`}
          name="correo"
          type="email"
          autoComplete="email"
          required
          placeholder="Tu correo"
          className={s.campo}
          aria-invalid={estado === "error"}
          aria-describedby={`${id}-nota`}
        />
        <button type="submit" className="btn btn-fg" disabled={estado === "enviando"}>
          {estado === "enviando" ? "Enviando…" : boton}
        </button>
      </div>
      {/* Campo trampa para bots: fuera de la vista y del teclado. */}
      <input type="text" name="web" tabIndex={-1} autoComplete="off" className={s.trampa} aria-hidden="true" />
      <p id={`${id}-nota`} className={s.nota} role={estado === "error" ? "alert" : undefined}>
        {estado === "error" ? (
          mensaje
        ) : (
          <>
            Solo te escribimos sobre esto. Lee la{" "}
            <Link href="/legal/privacidad" className="link">
              política de privacidad
            </Link>
            .
          </>
        )}
      </p>
    </form>
  );
}
