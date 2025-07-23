import { useState } from 'react';

function App() {
  const [consulta, setConsulta] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscar = async () => {
    if (!consulta.trim()) {
      setError('Por favor ingresa una consulta válida.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://vuelosbaratos.onrender.com/api/buscar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consulta })
      });
      const data = await res.json();
      if (data.resultados) {
        setResultados(data.resultados);
      } else {
        setResultados([]);
        setError('No se encontraron resultados.');
      }
    } catch (err) {
      console.error(err);
      setError('Error al procesar la búsqueda.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Buscador Inteligente de Viajes Baratos</h1>
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 w-full max-w-xl">
        <input
          type="text"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          placeholder="Ej: vuelos a Madrid por menos de 300"
          className="w-full p-3 border rounded shadow"
        />
        <button
          onClick={buscar}
          className="px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>

      {loading && <p className="text-gray-700">Buscando resultados...</p>}
      {error && <p className="text-red-600 font-semibold">{error}</p>}

      <ul className="mt-6 w-full max-w-2xl">
        {resultados.map((r, i) => (
          <li key={i} className="border-b py-3">
            <span className="font-semibold">{r.nombre || 'Paquete'}</span> – ${r.precio}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
