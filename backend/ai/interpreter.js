/**
 * Extrae un precio máximo simple desde la consulta.
 * Retorna un objeto con la consulta original y el precio detectado.
 */
function interpret(consulta) {
  const priceMatch = consulta.match(/(\d+)/);
  const precioMax = priceMatch ? parseInt(priceMatch[1] || priceMatch[0], 10) : null;
  return { consulta, precioMax };
}

module.exports = { interpret };
