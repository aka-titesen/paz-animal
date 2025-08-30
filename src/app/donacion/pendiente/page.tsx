import { obtenerDonacion } from '@/services/donaciones'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

interface PageProps {
  searchParams: {
    id?: string
  }
}

async function DonacionPendienteContent({ donacionId }: { donacionId: string }) {
  const donacion = await obtenerDonacion(donacionId)

  if (!donacion) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Pending Icon */}
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Pago en Proceso
          </h1>

          <p className="text-gray-600 mb-6">
            Tu donación de <strong>${donacion.monto.toString()}</strong> está siendo procesada.
            Esto puede tomar unos minutos.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>ID de transacción:</span>
                <span className="font-mono text-gray-900">{donacion.externalReference}</span>
              </div>
              <div className="flex justify-between">
                <span>Estado:</span>
                <span className="text-yellow-600 font-medium">
                  En proceso
                </span>
              </div>
            </div>
          </div>

          <div className="text-left text-gray-600 mb-6">
            <h3 className="font-medium mb-2">¿Qué significa esto?</h3>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Tu pago está siendo verificado</li>
              <li>Puede tomar entre 1 y 48 horas</li>
              <li>Recibirás un email cuando se confirme</li>
              <li>No realices otro pago por el mismo monto</li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="block w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Verificar estado
            </button>

            <Link
              href="/contacto"
              className="block w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Contactar soporte
            </Link>

            <Link
              href="/"
              className="block w-full text-gray-500 py-2 hover:text-gray-700 transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>

        {/* Info message */}
        <div className="mt-8 text-center">
          <div className="text-yellow-500 text-4xl mb-3">⏳</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Paciencia
          </h2>
          <p className="text-gray-600">
            Los pagos pueden tardar en procesarse según el método elegido. Te notificaremos por email.
          </p>
        </div>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Verificando estado del pago...</p>
      </div>
    </div>
  )
}

export default function DonacionPendientePage({ searchParams }: PageProps) {
  const donacionId = searchParams.id

  if (!donacionId) {
    notFound()
  }

  return (
    <Suspense fallback={<LoadingState />}>
      <DonacionPendienteContent donacionId={donacionId} />
    </Suspense>
  )
}
