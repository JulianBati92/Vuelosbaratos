import { useState } from 'react';
import Resultados from './Resultados';

export default function Buscador() {
  const [consulta, setConsulta] = useState('');
  const [resultados, setResultados] = useState(null);
  const [error, setError] = useState(null);

  const handleBuscar = async (e) => {
    e.preventDefault();
    const baseUrl = import.meta.env.VITE_BACKEND_URL || '';
    const res = await fetch(`${baseUrl}/api/buscar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ consulta }),
    });
    if (res.ok) {
      const data = await res.json();
      setResultados(data);
      setError(null);
    } else {
      const errText = await res.text();
      setError(errText || 'Error al buscar');
      setResultados(null);
    }
  };

  return (
    <>
      <form onSubmit={handleBuscar} className="space-y-3">
        <input
          type="text"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          placeholder="Ej: viaje a Río en agosto por menos de 300000"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Buscar
        </button>
      </form>
      {error && (
        <p className="text-red-600 mt-2">{error}</p>
      )}
      {resultados && <Resultados data={resultados} />}
    </>
  );
}
