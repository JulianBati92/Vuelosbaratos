import { useState } from 'react';
import Resultados from './Resultados';
import { searchFlights } from '../api'; // Ajustá la ruta si es necesario

export default function Buscador() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [resultados, setResultados] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBuscar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultados(null);
    try {
      const data = await searchFlights({ origin, destination, date });
      setResultados(data.offers || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleBuscar} className="space-y-3">
        <input
          type="text"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="Origen (ej: Buenos Aires)"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Destino (ej: Madrid)"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {resultados && <Resultados data={resultados} />}
    </>
  );
}
