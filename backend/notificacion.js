const twilio = require('twilio');

// 🔐 Reemplazá con tus credenciales de Twilio
const accountSid = 'AC5238ceecf313716ba830828e01ddc1b0';
const authToken = 'a498a71180b74635ff41c9f55e2da3ef';
const client = new twilio(accountSid, authToken);

// desde: número de Twilio habilitado para WhatsApp
const desde = 'whatsapp:+14155238886';
const a = 'whatsapp:+541160505888'; // Tu número real

exports.enviarNotificacion = async (mensaje) => {
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
