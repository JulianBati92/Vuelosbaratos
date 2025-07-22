import Buscador from './components/Buscador';

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Buscar paquetes baratos</h1>
        <Buscador />
      </div>
    </div>
  );
}
