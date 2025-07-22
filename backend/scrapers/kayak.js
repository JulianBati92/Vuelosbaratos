async function kayak(consulta) {
  return [
    {
      sitio: 'Kayak',
      titulo: `Resultado Kayak para ${consulta}`,
      precio: 160000,
    },
  ];
}

module.exports = kayak;
