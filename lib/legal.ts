import { CORREO } from "./contacto";
import { ENVIO } from "./orden";
import { formatCOP } from "./money";
import type { Bloque } from "./blog";

/**
 * Documentos legales de la tienda.
 *
 * BORRADOR: redactados a partir de la Ley 1581 de 2012 (datos personales) y
 * la Ley 1480 de 2011 (Estatuto del Consumidor). Deben revisarse con un
 * abogado antes de abrir la venta. Las políticas marcadas como propuesta
 * (cambios, tiempos de envío) son decisiones de la marca, no de la ley.
 *
 * Los datos de la empresa que falten se muestran como «por definir».
 */
export const EMPRESA = {
  razonSocial: "",
  nit: "",
  direccion: "",
  ciudad: "Medellín, Colombia",
};

const pendiente = (valor: string) => valor || "por definir";

export type Documento = {
  slug: string;
  titulo: string;
  resumen: string;
  actualizado: string;
  cuerpo: Bloque[];
};

const responsable = `Versé Intimates (razón social: ${pendiente(EMPRESA.razonSocial)}; NIT: ${pendiente(EMPRESA.nit)}), con domicilio en ${EMPRESA.direccion ? `${EMPRESA.direccion}, ` : ""}${EMPRESA.ciudad}. Correo: ${CORREO}.`;

export const DOCUMENTOS: Documento[] = [
  {
    slug: "privacidad",
    titulo: "Política de privacidad",
    resumen: "Qué datos pedimos, para qué los usamos y cómo puedes consultarlos o borrarlos.",
    actualizado: "2026-09-24",
    cuerpo: [
      { tipo: "subtitulo", texto: "Quién es responsable" },
      { tipo: "parrafo", texto: responsable },
      { tipo: "subtitulo", texto: "Qué datos recogemos" },
      {
        tipo: "parrafo",
        texto:
          "Cuando compras te pedimos nombre, documento de identidad, correo, teléfono y dirección de entrega. Los datos de pago los recibe directamente la pasarela Wompi; nosotros nunca vemos ni guardamos el número de tu tarjeta ni tus claves bancarias.",
      },
      {
        tipo: "parrafo",
        texto:
          "Tus favoritos y tu carrito se guardan solo en tu navegador. No los enviamos a ningún servidor.",
      },
      { tipo: "subtitulo", texto: "Para qué los usamos" },
      {
        tipo: "parrafo",
        texto:
          "Para preparar y enviar tu pedido, emitir la factura, responder tus preguntas y atender cambios o garantías. Solo te escribiremos con novedades de la marca si nos lo autorizas de forma expresa.",
      },
      {
        tipo: "parrafo",
        texto:
          "Compartimos tus datos únicamente con quienes intervienen en la compra: la pasarela de pago, la transportadora y el servicio con el que enviamos los correos del pedido. No los vendemos ni los cedemos a terceros para publicidad.",
      },
      { tipo: "subtitulo", texto: "Tus derechos" },
      {
        tipo: "parrafo",
        texto:
          "Según la Ley 1581 de 2012 puedes conocer, actualizar y rectificar tus datos, pedir prueba de la autorización que nos diste, saber cómo los hemos usado, revocar esa autorización o pedir que los borremos cuando no exista un deber legal de conservarlos, y presentar quejas ante la Superintendencia de Industria y Comercio.",
      },
      { tipo: "subtitulo", texto: "Cómo ejercerlos" },
      {
        tipo: "parrafo",
        texto: `Escríbenos a ${CORREO} con tu nombre, tu documento y lo que necesitas. Respondemos las consultas en un máximo de 10 días hábiles y los reclamos en un máximo de 15 días hábiles, como lo establece la ley.`,
      },
      {
        tipo: "parrafo",
        texto:
          "Conservamos los datos de cada pedido mientras lo exijan las normas contables y tributarias; los demás, mientras mantengas una relación con la marca o hasta que nos pidas borrarlos.",
      },
    ],
  },
  {
    slug: "terminos",
    titulo: "Términos y condiciones",
    resumen: "Cómo funciona una compra en Versé: precios, pagos, retracto y garantía.",
    actualizado: "2026-09-24",
    cuerpo: [
      { tipo: "subtitulo", texto: "Quién vende" },
      { tipo: "parrafo", texto: responsable },
      { tipo: "subtitulo", texto: "Precios y disponibilidad" },
      {
        tipo: "parrafo",
        texto:
          "Los precios están en pesos colombianos e incluyen IVA. El costo del envío se muestra en el carrito antes de pagar. Si una pieza se agota después de tu pago, te escribimos para cambiarla por otra o devolverte el dinero completo.",
      },
      { tipo: "subtitulo", texto: "Pago" },
      {
        tipo: "parrafo",
        texto:
          "Los pagos se procesan con Wompi, con tarjeta, PSE, Nequi o Bancolombia. El pedido queda confirmado cuando la pasarela aprueba la transacción; en ese momento te llega un correo con el detalle.",
      },
      { tipo: "subtitulo", texto: "Derecho de retracto" },
      {
        tipo: "parrafo",
        texto:
          "En las compras a distancia, el artículo 47 de la Ley 1480 de 2011 te permite retractarte dentro de los cinco días hábiles siguientes a la entrega. La misma norma exceptúa los bienes de uso personal, y la ropa interior lo es: por higiene, solo aceptamos devoluciones por retracto de piezas sin usar, con sus etiquetas y el sello protector intacto.",
      },
      {
        tipo: "parrafo",
        texto:
          "Cuando el retracto procede, devolvemos el dinero dentro de los 30 días calendario siguientes. El costo de enviarnos la pieza de vuelta corre por tu cuenta.",
      },
      { tipo: "subtitulo", texto: "Reversión del pago" },
      {
        tipo: "parrafo",
        texto:
          "Si pagaste con un medio electrónico y fuiste víctima de fraude, no hiciste la compra, no recibiste la pieza o te llegó una distinta o defectuosa, puedes pedir la reversión del pago dentro de los cinco días hábiles siguientes a que lo supiste, como lo prevé el artículo 51 de la Ley 1480. Escríbenos y avisa también a tu banco.",
      },
      { tipo: "subtitulo", texto: "Garantía" },
      {
        tipo: "parrafo",
        texto:
          "Cada pieza tiene garantía por defectos de fabricación, como costuras que se abren o herrajes que fallan con el uso normal. No cubre el desgaste natural ni los daños por lavado o secado distintos a los indicados en la etiqueta. Si algo llega mal, escríbenos con una foto y lo resolvemos con reparación, cambio o devolución del dinero.",
      },
      { tipo: "subtitulo", texto: "Ley aplicable" },
      {
        tipo: "parrafo",
        texto:
          "Estos términos se rigen por la ley colombiana. Si no llegamos a un acuerdo, puedes acudir a la Superintendencia de Industria y Comercio.",
      },
    ],
  },
  {
    slug: "envios-y-cambios",
    titulo: "Envíos y cambios",
    resumen: "Cuánto tarda y cuánto cuesta el envío, y cómo cambiar una talla.",
    actualizado: "2026-09-24",
    cuerpo: [
      { tipo: "subtitulo", texto: "Envíos" },
      {
        tipo: "parrafo",
        texto: `Enviamos a toda Colombia. El envío cuesta ${formatCOP(ENVIO.costo)} y es sin costo en pedidos desde ${formatCOP(ENVIO.gratisDesde)}. Los pedidos salen en uno o dos días hábiles después de confirmado el pago y llegan en dos a cinco días hábiles, según la ciudad.`,
      },
      {
        tipo: "parrafo",
        texto:
          "Cuando la caja sale te escribimos con el número de guía para que puedas seguirla.",
      },
      { tipo: "subtitulo", texto: "Cambios de talla" },
      {
        tipo: "parrafo",
        texto:
          "Si la talla no es la tuya, escríbenos dentro de los cinco días hábiles siguientes a recibir el pedido. La pieza debe estar sin usar, con sus etiquetas y el sello protector intacto. En tu primer pedido el envío del cambio corre por nuestra cuenta; en los siguientes, el de ida lo pagas tú y el de vuelta nosotros.",
      },
      {
        tipo: "parrafo",
        texto:
          "Por higiene no cambiamos panties, tangas ni bodies que hayan perdido el sello protector.",
      },
      { tipo: "subtitulo", texto: "Si algo llega mal" },
      {
        tipo: "parrafo",
        texto: `Escríbenos a ${CORREO} con el número de pedido y una foto. Lo resolvemos según la garantía descrita en los términos y condiciones.`,
      },
    ],
  },
];

export function getDocumento(slug: string): Documento | undefined {
  return DOCUMENTOS.find((d) => d.slug === slug);
}
