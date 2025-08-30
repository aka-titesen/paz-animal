import { obtenerDonacion } from '@/services/donaciones'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

interface PageProps {
  searchParams: {
    id?: string
  }
}

async function DonacionExitoContent({ donacionId }: { donacionId: string }) {
  const donacion = await obtenerDonacion(donacionId)

  if (!donacion) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Donación Exitosa!
          </h1>

          <p className="text-gray-600 mb-6">
            Tu donación de <strong>${donacion.monto.toString()}</strong> ha sido procesada exitosamente.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>ID de transacción:</span>
                <span className="font-mono text-gray-900">{donacion.externalReference}</span>
              </div>
              <div className="flex justify-between">
                <span>Estado:</span>
                <span className="text-green-600 font-medium">
                  {donacion.estado === 'APROBADA' ? 'Aprobado' : donacion.estado}
                </span>
              </div>
              {donacion.fechaPago && (
                <div className="flex justify-between">
                  <span>Fecha:</span>
                  <span>{new Date(donacion.fechaPago).toLocaleDateString('es-AR')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-center text-gray-600 mb-6">
            <p className="text-sm">
              Recibirás un email de confirmación con los detalles de tu donación.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Volver al inicio
            </Link>

            <Link
              href="/donar"
              className="block w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hacer otra donación
            </Link>
          </div>
        </div>

        {/* Thank you message */}
        <div className="mt-8 text-center">
          <div className="text-primary-600 text-4xl mb-3">🐾</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            ¡Gracias por tu generosidad!
          </h2>
          <p className="text-gray-600">
            Tu donación nos ayuda a seguir rescatando y cuidando animales en situación de vulnerabilidad.
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
        <p className="text-gray-600">Verificando tu donación...</p>
      </div>
    </div>
  )
}

export default function DonacionExitoPage({ searchParams }: PageProps) {
  const donacionId = searchParams.id

  if (!donacionId) {
    notFound()
  }

  return (
    <Suspense fallback={<LoadingState />}>
      <DonacionExitoContent donacionId={donacionId} />
    </Suspense>
  )
}
