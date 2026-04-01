const WHATSAPP_NUMBER = '5493517064453' // +54 9 3517 06-4453

export function getWhatsAppUrl(workTitle?: string): string {
  const message = workTitle
    ? `Hola Cristian, me interesa la escultura ${workTitle}`
    : 'Hola Cristian, me gustaría hacer una consulta'

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
