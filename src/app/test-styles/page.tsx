export default function TestPage() {
  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Test de Estilos Tailwind
        </h1>
        <p className="text-gray-600 mb-6">
          Si puedes ver este texto con estilos, Tailwind está funcionando correctamente.
        </p>
        <div className="space-y-4">
          <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Botón Azul
          </button>
          <button className="w-full bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600">
            Botón Verde (Primary)
          </button>
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            Caja verde con borde
          </div>
        </div>
      </div>
    </div>
  );
}
