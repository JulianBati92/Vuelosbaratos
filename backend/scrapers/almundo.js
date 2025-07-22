async function almundo(consulta) {
  // Aquí iría el scraping real a Almundo. Para efectos de ejemplo
  // devolvemos datos estáticos.
  return [
    {
      sitio: 'Almundo',
      titulo: `Oferta Almundo para ${consulta}`,
      precio: 150000,
    },
  ];
}

module.exports = almundo;
