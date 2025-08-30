import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Nosotros | Fundación Paz Animal',
  description: 'Conoce nuestra misión, visión y valores. Fundación Paz Animal, dedicada a la protección y rescate de animales en Corrientes, Argentina desde 2020.',
  keywords: 'fundación paz animal, protección animal, rescate animales, corrientes, argentina, misión, visión, valores',
  openGraph: {
    title: 'Nosotros | Fundación Paz Animal',
    description: 'Conoce nuestra misión, visión y valores. Fundación dedicada a la protección animal.',
    type: 'website',
  },
}

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Fundación <span className="text-primary-600">Paz Animal</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Dedicados a la protección y rescate de animales desde 2020
          </p>
          <div className="w-24 h-1 bg-primary-600 mx-auto"></div>
        </div>
      </section>

      {/* Historia */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestra Historia
            </h2>
            <p className="text-lg text-gray-600">
              En 2020, en la ciudad de Corrientes, Argentina, nació un sueño de crear un mundo
              mejor para los animales. Fundación Paz Animal se estableció con la firme convicción
              de que todos los seres vivos merecen respeto, cuidado y protección.
            </p>
          </div>
        </div>
      </section>

      {/* Misión, Visión, Valores */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Misión */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Misión</h3>
              <p className="text-gray-600">
                Proteger, rescatar y rehabilitar animales en situación de vulnerabilidad,
                promoviendo el respeto hacia todas las formas de vida animal y educando
                a la comunidad sobre el cuidado responsable.
              </p>
            </div>

            {/* Visión */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Visión</h3>
              <p className="text-gray-600">
                Ser una organización referente en protección animal en Argentina,
                creando una sociedad más consciente y compasiva donde los animales
                vivan libres de maltrato y abandono.
              </p>
            </div>

            {/* Valores */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Valores</h3>
              <div className="text-gray-600 space-y-2">
                <div className="font-semibold">• Compasión</div>
                <div className="font-semibold">• Transparencia</div>
                <div className="font-semibold">• Compromiso</div>
                <div className="font-semibold">• Respeto</div>
                <div className="font-semibold">• Responsabilidad</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Únete a Nuestra Causa
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Cada acción cuenta. Juntos podemos crear un mundo mejor para los animales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/donar"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              Hacer una Donación
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
