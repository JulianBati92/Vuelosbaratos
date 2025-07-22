const almundo = require('./almundo');
const kayak = require('./kayak');
const turismocity = require('./turismocity');

async function ejecutarTodos(consulta) {
  const resultados = await Promise.all([
    almundo(consulta),
    kayak(consulta),
    turismocity(consulta),
  ]);
  return resultados.flat();
}

module.exports = ejecutarTodos;
