async function turismocity(consulta) {
  return [
    {
      sitio: 'Turismocity',
      titulo: `Propuesta Turismocity para ${consulta}`,
      precio: 155000,
    },
  ];
}

module.exports = turismocity;
