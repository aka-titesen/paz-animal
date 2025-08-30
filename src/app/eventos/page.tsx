import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Eventos - Paz Animal',
  description: 'Próximos eventos y actividades de la Fundación Paz Animal. Participa en nuestras iniciativas para proteger y cuidar a los animales.',
  openGraph: {
    title: 'Eventos - Paz Animal',
    description: 'Próximos eventos y actividades de la Fundación Paz Animal.',
    type: 'website',
  },
}

export default function EventosPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Próximos Eventos
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Únete a nuestras actividades y eventos para hacer la diferencia en la vida de los animales
            </p>
          </div>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center py-16">
          <div className="text-primary-600 text-6xl mb-6">📅</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Próximamente!
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Estamos preparando eventos increíbles para que puedas participar en nuestras iniciativas
            de protección animal. Mantente atento a nuestras redes sociales para ser el primero en conocer
            las próximas actividades.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="text-primary-600 text-4xl mb-4">🐕</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Jornadas de Adopción
              </h3>
              <p className="text-gray-600">
                Eventos especiales donde podrás conocer a nuestros rescatados y encontrar a tu nuevo mejor amigo.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <div className="text-primary-600 text-4xl mb-4">💚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Charlas Educativas
              </h3>
              <p className="text-gray-600">
                Aprende sobre cuidado responsable, primeros auxilios veterinarios y tenencia responsable.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <div className="text-primary-600 text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Campañas de Concientización
              </h3>
              <p className="text-gray-600">
                Actividades en la comunidad para promover el respeto y cuidado hacia los animales.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <Link
              href="/contacto"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Contáctanos para más información
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
