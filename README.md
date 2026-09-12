# Versé Intimates

Tienda de la marca. Next.js 16 (App Router) + React 19 + TypeScript, sin framework de
CSS: el sistema de diseño vive en `app/globals.css` y en módulos CSS por componente.

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

## Dirección de arte: «Umbral»

La llave de la marca no es un adorno: es el mecanismo del sitio. La página empieza
cerrada y se abre.

**Paleta.** Dos mundos que se alternan a pantalla completa. Los tokens semánticos
(`--bg`, `--fg`, `--muted`, `--line`, `--accent`) se reasignan según `data-panel`, así que
cada componente se escribe una sola vez y funciona en los dos.

| | Noche | Seda |
|---|---|---|
| Fondo | `#140E0E` | `#E9E3DB` |
| Texto | `#E9E3DB` | `#191413` |
| Neutro | `#9C8A8C` | `#7A6A6C` |
| Rose gold | `#C98F6F` | `#A96A4C` |

**Tipografía.** Italiana (display), Spectral Light (cuerpo), Archivo (11px mayúsculas
para nav, precios y tallas). Cargadas con `next/font`, sin peticiones a terceros.

**Tres momentos animados, no veinte.** La apertura de la caja (una vez por sesión), las
costuras rose entre paneles, y el descubierto de «La llave». Nada más se mueve.

### Reglas de composición

Se verifican en cada revisión. Son lo que impide que el sitio derive hacia plantilla:

- Ninguna sección repite la estructura de la anterior.
- `border-radius: 0` en todo el sitio; la única excepción es el contador del carrito.
- Cero `box-shadow`: la profundidad la dan el contraste de panel y las hairlines.
- El rose gold aparece solo como línea de 1px, anillo de foco y sello. Nunca como
  relleno de botón ni como degradado.
- El precio va en 11px y nunca se destaca.

---

## Estructura

```
app/
  page.tsx                 home — siete paneles alternados
  coleccion/               catálogo con filtro por línea
  producto/[slug]/         ficha de pieza
  carrito/  pedido/        carrito y retorno de la pasarela
  api/checkout/            firma el pago (solo servidor)
  api/wompi/webhook/       recibe y valida los eventos de Wompi
components/
  umbral.tsx               la caja que se abre
  panel.tsx  seam.tsx      paneles a sangre y sus costuras
  lace-canvas.tsx          grabado de encaje generativo
  key-reveal.tsx           el encaje que el cursor descubre
lib/
  products.ts              catálogo — fuente de verdad
  cart.ts(x)               carrito en localStorage
  orden.ts                 totales y envío
  wompi.ts                 firma de integridad y validación de eventos
```

---

## Cambiar el catálogo

Todo está en [`lib/products.ts`](lib/products.ts). Editas nombre, precio, descripción,
materiales o tallas y el sitio entero se actualiza. **Los precios y los textos actuales
son un marcador de posición**: cámbialos antes de abrir la tienda.

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

Enlace de salto al contenido, anillo de foco rose visible en cada parada, la apertura y
el descubierto se desactivan con `prefers-reduced-motion`, y sin JavaScript la página se
lee completa: las hojas de la caja están ocultas por defecto y solo aparecen cuando el
script las habilita.

---

## Publicar

Pensado para Vercel. Sube el repo, importa el proyecto y carga las mismas variables de
`.env.local` en el panel de Vercel —con las llaves de **producción** cuando abras—, más
`NEXT_PUBLIC_SITE_URL` con tu dominio.
