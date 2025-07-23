const express = require('express');
const ejecutarScrapers = require('../scrapers'); // este módulo debe existir
const { interpret } = require('../ai/interpreter'); // este también debe existir

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { consulta = '' } = req.body || {};
    const { precioMax } = interpret(consulta); // IA que extrae el precio si hay
    let resultados = await ejecutarScrapers(consulta);
    if (precioMax) {
      resultados = resultados.filter(
        (r) => typeof r.precio === 'number' && r.precio <= precioMax
      );
      resultados.sort((a, b) => (a.precio || Infinity) - (b.precio || Infinity));
    }

    res.json({ filtro: { consulta, precioMax }, resultados });
  } catch (err) {
    console.error('Error en /api/buscar:', err);
    res.status(500).json({ error: 'Error al procesar la búsqueda' });
  }
});

module.exports = router;

