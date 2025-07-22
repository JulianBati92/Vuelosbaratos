const express = require('express');
const ejecutarScrapers = require('../scrapers');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { consulta = '' } = req.body || {};
    const resultados = await ejecutarScrapers(consulta);
    res.json({ filtro: { consulta }, resultados });
  } catch (err) {
    console.error('Error en /api/buscar:', err);
    res.status(500).json({ error: 'Error al procesar la búsqueda' });
  }
});

module.exports = router;
