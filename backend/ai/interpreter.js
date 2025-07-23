exports.interpret = function (texto) {
  const match = texto.match(/(menor a|menos de)\s*(\d+)/i);
  if (match) {
    return { precioMax: parseInt(match[2], 10) };
  }
  return { precioMax: null };
};
