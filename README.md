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

Versé tiene cinco firmas visuales, en `components/firmas/`:

- **El hilo** (`hilo.tsx`): reemplaza las líneas rectas. Cuelga entre secciones, respira y se
  deja llevar por el cursor.
- **La tela** (`tela.tsx`, PixiJS): seda que ondula bajo el cursor, en momentos puntuales.
- **La moldería** (`molderia.tsx`): patronaje con medidas reales, detrás de la guía de tallas.
- **La seda** (`menu-seda.tsx` y la caja de entrada): el menú y la apertura son dos hojas de
  seda que se cierran o se abren; al entrar, la seda ondea.
- **Aurora como luz** (`transicion-aurora.tsx`): en la portada, el fondo recorre los cuatro
  momentos al bajar.

Las fotos de producto van en arco de espejo, el óvalo del emblema; la foto de la
colección, con marcas de corte en las esquinas. En la tienda, cada producto lleva una
etiqueta colgante.

**Paleta.** Sale del moodboard de Aurora. Los tokens semánticos (`--bg`, `--fg`, `--muted`,
`--line`, `--accent`) se reasignan según `data-panel`, así que cada componente se escribe
una vez y sirve en los dos fondos. `/aurora` define además sus propios tokens por momento.

| | Noche | Seda |
|---|---|---|
| Fondo | `#060608` (negro de Noctis) | `#E5E1E2` (perla de Prima Luce) |
| Texto | `#ECE8EA` | `#231D2E` |
| Neutro | `#9D95A4` | `#5E5468` |
| Acento | oro rosa `#DEA193` | morado de Vigilia `#493B63` |

El oro rosa y su versión honda `#C4734A` son el metal del logo y se reservan para la marca.

**Tipografía.** Dos cortes de los tipos Fell (imprenta inglesa, fines del siglo XVII):
IM Fell French Canon para el nombre, títulos, lema y citas, e IM Fell Great Primer para todo
lo demás, en minúscula normal. Solo existen en peso normal; su tinta irregular es parte del
carácter. Se eligieron entre candidatas poco usadas. Se cargan con `next/font`.

**Qué evitar** (se ve genérico, hecho con AI): cuadrículas de tarjetas idénticas, etiquetas en
mayúsculas espaciadas sobre los títulos, datos unidos con «·», botones que no llevan a ningún
lado, resplandores y animaciones sin propósito.

---

## Estructura

```
app/
  page.tsx                 portada
  productos/               todos los productos de todas las colecciones
  aurora/                  historia de la colección y tienda (?view=productos,
                           &momento=noctis|vigilia|borealis|prima-luce, &tipo=…)
  producto/[slug]/         ficha de pieza
  blog/  blog/[slug]/      diario
  carrito/  favoritos/     carrito y favoritos (localStorage)
  pedido/                  retorno de la pasarela de pago
  legal/[slug]/            privacidad, términos, envíos y cambios
  sitemap.ts  robots.ts    SEO
  opengraph-image.tsx      imagen al compartir un enlace
  api/checkout/            firma el pago (solo servidor)
  api/lista/               inscripciones a la lista privada (llegan por correo)
  api/wompi/webhook/       recibe y valida los eventos de Wompi
components/
  umbral.tsx               la caja que se abre al entrar
  panel.tsx  seam.tsx      paneles a sangre y el filete entre ellos
  lace-canvas.tsx          grabado de encaje generativo (hace de foto)
  key-reveal.tsx           el encaje que el cursor descubre (hero)
  lista-privada.tsx        inscripción a la primera edición
  aurora/                  cielo, velos y enlaces de la historia
  grupo-piezas.tsx         un tipo de prenda del catálogo (reutilizable)
  filtro-tipo.tsx          filtro por tipo de prenda
lib/
  colecciones.ts           registro de colecciones
  products.ts              catálogo: fuente de verdad
  legal.ts                 textos legales (borrador) y datos de la empresa
  provisional.ts           fotos (Unsplash) y precios en 0 para ver el sitio; ACTIVO = false los quita
  historia.ts              versos de la historia de Aurora
  blog.ts                  entradas del diario
  cart.tsx  favoritos.tsx  estado en localStorage
  orden.ts                 totales y envío
  wompi.ts                 firma de integridad y validación de eventos
```

---

## Agregar una colección

1. Súmala a `COLECCIONES` en [`lib/colecciones.ts`](lib/colecciones.ts). Aparece sola en el
   menú, el pie, el filtro de `/productos` y el sitemap.
2. Carga sus piezas en `lib/products.ts` con su `coleccion`.
3. Crea su página en `app/<id>/page.tsx`. Para el catálogo puedes reutilizar
   `components/grupo-piezas.tsx`.

---

## Textos legales

Están en [`lib/legal.ts`](lib/legal.ts) y son **un borrador**: hay que revisarlos con un
abogado antes de abrir la venta. Completa `EMPRESA` (razón social, NIT, dirección);
mientras esté vacío, el sitio muestra «por definir».

---

## Cambiar el catálogo

Todo está en [`lib/products.ts`](lib/products.ts). Editas nombre, precio, descripción,
materiales o tallas y el sitio entero se actualiza. Hoy ninguna pieza tiene
`precio` ni `descripcion`, así que todas se muestran como «todavía no está a la venta».
Cuando una pieza tenga `precio`, aparece el selector de talla y el botón de compra.

### Cuando tengas fotos

Hoy se ven fotos provisionales de Unsplash (`lib/provisional.ts`). Cuando lleguen las
propias, pon los archivos en `public/piezas/`, añade `image` a cada pieza y cambia
`ACTIVO` a `false` en `lib/provisional.ts`:

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

Enlace de salto al contenido, anillo de foco visible en cada parada, contraste mínimo de
4,5:1 en texto, y el descubierto del encaje queda quieto con `prefers-reduced-motion`.

---

## Publicar

Pensado para Vercel. Sube el repo, importa el proyecto y carga las mismas variables de
`.env.local` en el panel de Vercel —con las llaves de **producción** cuando abras—, más
`NEXT_PUBLIC_SITE_URL` con tu dominio.
