const ejecutarScrapers = require('../backend/scrapers');
const { interpret } = require('../backend/ai/interpreter');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  let raw = '';
  for await (const chunk of req) raw += chunk;
  const body = raw ? JSON.parse(raw) : {};
  const { consulta = '' } = body;

  try {
    const { precioMax } = interpret(consulta);
    let resultados = await ejecutarScrapers(consulta);
    if (precioMax) {
      resultados = resultados.filter(
        (r) => typeof r.precio === 'number' && r.precio <= precioMax
      );
    }
    resultados.sort((a, b) => (a.precio || Infinity) - (b.precio || Infinity));
    res.status(200).json({ filtro: { consulta, precioMax }, resultados });
  } catch (err) {
    console.error('Error en /api/buscar:', err);
    res.status(500).json({ error: 'Error al procesar la búsqueda' });
  }
};
