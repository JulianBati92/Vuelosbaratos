const express = require('express');
const ejecutarScrapers = require('../scrapers');
const { interpret } = require('../ai/interpreter');
const { enviarNotificacion } = require('../notificacion');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { consulta = '' } = req.body || {};
    const { precioMax } = interpret(consulta);
    let resultados = await ejecutarScrapers(consulta);

    if (precioMax) {
      resultados = resultados.filter(
        (r) => typeof r.precio === 'number' && r.precio <= precioMax
      );
      resultados.sort((a, b) => (a.precio || Infinity) - (b.precio || Infinity));
    }

    res.json({ filtro: { consulta, precioMax }, resultados });

    if (resultados.length > 0) {
      const top = resultados[0];
      const mensaje = `🔔 Nuevo paquete encontrado:\n${top.nombre} – $${top.precio}`;
      enviarNotificacion(mensaje);
    }
  } catch (err) {
    console.error('Error en /api/buscar:', err);
    res.status(500).json({ error: 'Error al procesar la búsqueda' });
  }
});

module.exports = router;

