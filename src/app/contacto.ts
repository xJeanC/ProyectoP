/** Datos de contacto de IceCul, usados en el menú, el pie y los formularios. */
export const CONTACTO = {
  whatsapp: '573002270909',
  whatsappVisible: '300 227 0909',
  telefono: '300 234 6789',
  correo: 'Info@CreamCUL.com',
  direccion: 'Cl. 58 #55-24 A, Barranquilla, Atlántico',
  ciudad: 'Barranquilla, Colombia',
};

/** Arma un enlace de WhatsApp con un mensaje ya escrito. */
export function enlaceWhatsapp(mensaje?: string): string {
  const base = `https://wa.me/${CONTACTO.whatsapp}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}
