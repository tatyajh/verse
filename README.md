# Versé Intimates

Tienda de lencería de Versé, de Medellín. Next.js 16 (App Router), React 19 y
TypeScript, sin framework de CSS: los estilos están en `app/globals.css` y en módulos CSS
por componente.

---

## Arrancar

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>. Si `node` no está en el PATH de tu terminal, primero:

```bash
source ~/.zshrc
```

Otros comandos: `npm run build` (producción), `npm run lint`, `npx tsc --noEmit`.

---

## Diseño

Al entrar, la página muestra una caja que se abre una vez por sesión (`components/umbral.tsx`).
Después, la portada alterna paneles oscuros (noche) y claros (seda).

**Paleta.** Los tokens semánticos (`--bg`, `--fg`, `--muted`, `--line`, `--accent`) se
reasignan según `data-panel`, así que cada componente se escribe una vez y sirve en los
dos fondos. `/aurora` define además sus propios tokens por momento (Noctis, Vigilia,
Borealis, Prima Luce) en `app/aurora/aurora.module.css`.

| | Noche | Seda |
|---|---|---|
| Fondo | `#140E0E` | `#E9E3DB` |
| Texto | `#E9E3DB` | `#191413` |
| Neutro | `#9C8A8C` | `#7A6A6C` |
| Acento | oro rosa `#DEA193` | bronce `#C4734A` |

**Tipografía.** Bodoni Moda (títulos), Pinyon Script (solo lema y citas), Spectral
(cuerpo) y Archivo (nav, tallas y precios en mayúsculas pequeñas). Se cargan con
`next/font`.

**Movimiento.** La caja de entrada, las costuras entre paneles, el encaje de «La llave»
que se descubre con el cursor y, en `/aurora`, el cielo que cambia con el scroll y el
encaje sobre cada capítulo. Todo se apaga con `prefers-reduced-motion`.

---

## Estructura

```
app/
  page.tsx                 portada
  aurora/                  historia de la colección y tienda (?view=productos,
                           &momento=noctis|vigilia|borealis|prima-luce, &tipo=…)
  producto/[slug]/         ficha de pieza
  blog/  blog/[slug]/      diario
  carrito/  favoritos/     carrito y favoritos (localStorage)
  pedido/                  retorno de la pasarela de pago
  api/checkout/            firma el pago (solo servidor)
  api/wompi/webhook/       recibe y valida los eventos de Wompi
components/
  umbral.tsx               la caja de entrada
  panel.tsx  seam.tsx      paneles a sangre y sus costuras
  lace-canvas.tsx          grabado de encaje generativo (hace de foto)
  key-reveal.tsx           «La llave»
  aurora/                  cielo, velos y enlaces de la historia
lib/
  products.ts              catálogo: fuente de verdad
  historia.ts              versos de Aurora (no editar sin la autora)
  blog.ts                  entradas del diario
  cart.tsx  favoritos.tsx  estado en localStorage
  orden.ts                 totales y envío
  wompi.ts                 firma de integridad y validación de eventos
```

---

## Cambiar el catálogo

Todo está en [`lib/products.ts`](lib/products.ts). Editas nombre, precio, descripción,
materiales o tallas y el sitio entero se actualiza. Hoy ninguna pieza tiene
`precio` ni `descripcion`, así que todas se muestran como «todavía no está a la venta».
Cuando una pieza tenga `precio`, aparece el selector de talla y el botón de compra.

### Cuando tengas fotos

Pon los archivos en `public/piezas/` y añade `image` a la pieza:

```ts
{
  slug: "aurore",
  image: "/piezas/aurore.jpg",   // proporción 4:5
  ...
}
```

El grabado de encaje desaparece solo. Mientras no haya `image`, cada pieza dibuja su
propio grabado —sembrado con su slug, idéntico entre recargas— en vez de un hueco gris.

---

## Pagos (Wompi)

**Esto lo tienes que hacer tú**, porque implica crear una cuenta y manejar credenciales:

1. Abre tu comercio en <https://comercios.wompi.co>.
2. En **Desarrolladores** copia las cuatro llaves de **Sandbox**.
3. `cp .env.local.example .env.local` y pégalas ahí. `.env.local` nunca se sube a git.
4. Registra el webhook apuntando a `https://tu-dominio/api/wompi/webhook`.

Sin llaves el sitio funciona completo y el botón de pagar responde *«Los pagos todavía
no están configurados»*, que es lo correcto mientras tanto.

### Cómo funciona

El navegador nunca decide cuánto se cobra. `POST /api/checkout` recalcula el total desde
`products.ts`, genera la referencia y firma
`SHA256(referencia + centavos + "COP" + secreto)` en el servidor. Wompi devuelve a
`/pedido?id=…`, que consulta la transacción con la llave privada. El webhook valida el
checksum del evento antes de creer nada: un POST falso recibe 401.

Verificado contra el ejemplo publicado en la documentación de Wompi y con eventos
firmados y manipulados.

### Envíos

`lib/orden.ts` trae envío de $15.000 y gratis desde $250.000. **Son un supuesto, no una
decisión de la marca**: cámbialos cuando cierres tarifa con la transportadora.

### Sin base de datos todavía

Los pedidos se avisan por correo: uno al abrir el checkout, con piezas y tallas, y otro
al confirmarse el pago, unidos por la referencia. Configura `RESEND_API_KEY` y
`ORDER_NOTIFY_EMAIL` para recibirlos; sin eso quedan en el log del servidor. Guardar
órdenes en base de datos es el siguiente paso, no está hecho.

---

## Accesibilidad

Enlace de salto al contenido, anillo de foco visible en cada parada, la apertura y
el descubierto se desactivan con `prefers-reduced-motion`, y sin JavaScript la página se
lee completa: las hojas de la caja están ocultas por defecto y solo aparecen cuando el
script las habilita.

---

## Publicar

Pensado para Vercel. Sube el repo, importa el proyecto y carga las mismas variables de
`.env.local` en el panel de Vercel —con las llaves de **producción** cuando abras—, más
`NEXT_PUBLIC_SITE_URL` con tu dominio.
