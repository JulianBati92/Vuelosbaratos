export default function Resultados({ data }) {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Resultados</h2>
      <p>Filtro: {JSON.stringify(data.filtro)}</p>
      <div className="space-y-4 mt-4">
        {data.resultados.map((r, i) => (
          <div key={i} className="p-4 border rounded shadow-sm">
            <strong>{r.sitio}</strong>: {r.titulo} — ARS {r.precio.toLocaleString()}
          </div>
        ))}
      </div>
    </div>
  );
}
