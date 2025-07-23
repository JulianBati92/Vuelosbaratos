/**
 * Extrae un precio máximo simple desde la consulta.
 * Retorna un objeto con la consulta original y el precio detectado.
 */
function interpret(consulta) {
  const match = consulta.match(/(\d[\d.,]*)\s*(k|mil)?/i);
  let precioMax = null;
  if (match) {
    let numero = match[1].replace(/[.,]/g, '');
    precioMax = parseInt(numero, 10);
    if (match[2]) {
      precioMax *= 1000;
    }
  }
  return { consulta, precioMax };
}

module.exports = { interpret };
