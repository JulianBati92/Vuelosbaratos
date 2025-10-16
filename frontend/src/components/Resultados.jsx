function formatDate(isoString) {
  try {
    return new Date(isoString).toLocaleString();
  } catch (err) {
    return isoString;
  }
}

export default function Resultados({ vuelos }) {
  if (!vuelos.length) {
    return (
      <div className="mt-6 text-center text-gray-600">
        No encontramos vuelos para los criterios seleccionados.
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-semibold">Resultados</h2>
      {vuelos.map((vuelo, index) => {
        const primerTramo = vuelo.route?.[0];
        const ultimoTramo = vuelo.route?.[vuelo.route.length - 1];
        const aerolineas = vuelo.airlines?.join(', ');
        const escalas = Math.max(0, (vuelo.route?.length || 1) - 1);
        const duracion = vuelo.fly_duration;
        const baggageInfo = vuelo.bags_price
          ? Object.entries(vuelo.bags_price).map(([count, price]) =>
              `${count} ${count === '1' ? 'valija' : 'valijas'}: USD ${price}`
            )
          : [];

        return (
          <div key={vuelo.id || index} className="p-4 border rounded shadow-sm bg-gray-50">
            <div className="flex justify-between flex-wrap gap-2">
              <div>
                <p className="font-semibold">{primerTramo?.fly_from} → {ultimoTramo?.fly_to}</p>
                <p className="text-sm text-gray-600">Salida: {formatDate(primerTramo?.local_departure)}</p>
                <p className="text-sm text-gray-600">Llegada: {formatDate(ultimoTramo?.local_arrival)}</p>
                {duracion && <p className="text-sm text-gray-600">Duración: {duracion}</p>}
                <p className="text-sm text-gray-600">Escalas: {escalas}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">USD {vuelo.price}</p>
                {aerolineas && <p className="text-sm text-gray-600">{aerolineas}</p>}
              </div>
            </div>
            {baggageInfo.length > 0 && (
              <p className="mt-2 text-xs text-gray-500">
                Equipaje disponible: {baggageInfo.join(', ')}
              </p>
            )}
            {vuelo.deep_link && (
              <a
                href={vuelo.deep_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm text-blue-600 hover:underline"
              >
                Ver detalles y comprar
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
