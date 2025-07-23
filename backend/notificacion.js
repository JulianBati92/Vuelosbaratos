const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
if (!accountSid || !authToken) {
  console.warn('Twilio no configurado: falta TWILIO_ACCOUNT_SID o TWILIO_AUTH_TOKEN');
}
const client = accountSid && authToken ? new twilio(accountSid, authToken) : null;

const desde = 'whatsapp:+14155238886';
const a = 'whatsapp:+541160505888';

exports.enviarNotificacion = async (mensaje) => {
  if (!client) return;
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

