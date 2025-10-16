import { useState } from 'react';
import Resultados from './Resultados';
import { searchFlights } from '../api';

export default function Buscador() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [resultados, setResultados] = useState(null);
  const [summary, setSummary] = useState(null);
  const [resolvedCodes, setResolvedCodes] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBuscar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultados(null);
    setSummary(null);
    setResolvedCodes(null);
    try {
      const data = await searchFlights({ origin, destination, date });
      if (!data.ok) {
        throw new Error(data.error || 'Error al buscar vuelos');
      }
      setResultados(data.offers || []);
      setSummary(data.summary || null);
      setResolvedCodes({
        origin: data.origin || { term: origin },
        destination: data.destination || { term: destination }
      });
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
      {summary && (
        <div className="mt-4 p-3 border-l-4 border-blue-500 bg-blue-50 text-sm text-blue-900">
          {summary}
        </div>
      )}
      {resolvedCodes && (
        <p className="mt-4 text-sm text-gray-600">
          Búsqueda: {resolvedCodes.origin?.term} ({resolvedCodes.origin?.code}) →{' '}
          {resolvedCodes.destination?.term} ({resolvedCodes.destination?.code})
        </p>
      )}
      {resultados && <Resultados vuelos={resultados} />}
    </>
  );
}
