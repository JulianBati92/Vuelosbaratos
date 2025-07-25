const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function searchFlights({ origin, destination, date }) {
  const res = await fetch(`${API_URL}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origin, destination, date }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Error al buscar vuelos');
  }
  return res.json();
}
