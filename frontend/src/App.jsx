import Buscador from './components/Buscador';

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Buscador Inteligente de Viajes Baratos
        </h1>
        <Buscador />
      </div>
    </div>
  );
}
