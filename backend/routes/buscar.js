const express = require('express');
const ejecutarScrapers = require('../scrapers');
const { interpret } = require('../ai/interpreter');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { consulta = '' } = req.body || {};
    const { precioMax } = interpret(consulta);

    let resultados = await ejecutarScrapers(consulta);
    if (precioMax) {
      resultados = resultados.filter(r =>
        typeof r.precio === 'number' && r.precio <= precioMax
      );
    }

    res.json({ filtro: { consulta, precioMax }, resultados });
  } catch (err) {
    console.error('Error en /api/buscar:', err);
    res.status(500).json({ error: 'Error al procesar la búsqueda' });
  }
});

module.exports = router;
