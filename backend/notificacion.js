const twilio = require('twilio');

/**
 * Devuelve una instancia del cliente de Twilio si hay credenciales.
 * Si faltan variables de entorno se devuelve null y los mensajes se loggean.
 */
function crearCliente() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) {
    console.warn('Twilio no configurado: falta TWILIO_ACCOUNT_SID o TWILIO_AUTH_TOKEN');
    return null;
  }
  return twilio(accountSid, authToken);
}

const client = crearCliente();

// desde: número de Twilio habilitado para WhatsApp
const desde = process.env.TWILIO_FROM || 'whatsapp:+14155238886';
const a = process.env.TWILIO_TO; // Tu número real (whatsapp:+...)

exports.enviarNotificacion = async (mensaje) => {
  if (!client || !a) {
    console.log('Notificación:', mensaje);
    return;
  }
  try {
    await client.messages.create({
      from: desde,
      to: a,
      body: mensaje
    });
    console.log('✅ WhatsApp enviado');
  } catch (error) {
    console.error('❌ Error al enviar WhatsApp:', error.message);
  }
};
