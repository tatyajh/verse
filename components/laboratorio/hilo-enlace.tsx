"use client";

import Link from "next/link";
import { useState } from "react";
import Hilo from "./hilo";
import s from "./hilo-enlace.module.css";

/**
 * Un llamado a la acción sin píldora: el texto y, debajo, un hilo que cuelga.
 * Al acercar el cursor el hilo se tensa, como si alguien tirara de él.
 */
export default function HiloEnlace({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const [tenso, setTenso] = useState(false);
  return (
    <Link
      href={href}
      className={s.enlace}
      onPointerEnter={() => setTenso(true)}
      onPointerLeave={() => setTenso(false)}
      onFocus={() => setTenso(true)}
      onBlur={() => setTenso(false)}
    >
      <span className={s.texto}>{children}</span>
      <Hilo caida={tenso ? 0 : 9} alto={24} className={s.hilo} />
    </Link>
  );
}
