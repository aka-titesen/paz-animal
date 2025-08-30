import { obtenerDonacion } from '@/services/donaciones'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

interface PageProps {
  searchParams: {
    id?: string
  }
}

async function DonacionErrorContent({ donacionId }: { donacionId: string }) {
  const donacion = await obtenerDonacion(donacionId)

  if (!donacion) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error en el Pago
          </h1>

          <p className="text-gray-600 mb-6">
            Hubo un problema al procesar tu donación de <strong>${donacion.monto.toString()}</strong>.
            El pago no pudo ser completado.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>ID de transacción:</span>
                <span className="font-mono text-gray-900">{donacion.externalReference}</span>
              </div>
              <div className="flex justify-between">
                <span>Estado:</span>
                <span className="text-red-600 font-medium">
                  {donacion.estado === 'RECHAZADA' ? 'Rechazado' : donacion.estado}
                </span>
              </div>
            </div>
          </div>

          <div className="text-left text-gray-600 mb-6">
            <h3 className="font-medium mb-2">Posibles causas:</h3>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Fondos insuficientes en la tarjeta</li>
              <li>Datos de tarjeta incorrectos</li>
              <li>Tarjeta vencida o bloqueada</li>
              <li>Límites de transacción superados</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link
              href="/donar"
              className="block w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Intentar nuevamente
            </Link>

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

        {/* Support message */}
        <div className="mt-8 text-center">
          <div className="text-gray-400 text-4xl mb-3">💡</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            ¿Necesitas ayuda?
          </h2>
          <p className="text-gray-600">
            Si el problema persiste, contáctanos y te ayudaremos a completar tu donación.
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

export default function DonacionErrorPage({ searchParams }: PageProps) {
  const donacionId = searchParams.id

  if (!donacionId) {
    notFound()
  }

  return (
    <Suspense fallback={<LoadingState />}>
      <DonacionErrorContent donacionId={donacionId} />
    </Suspense>
  )
}
