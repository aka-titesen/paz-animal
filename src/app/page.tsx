export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">
                🐾 Paz Animal
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8 items-center">
              <a href="#" className="text-gray-700 hover:text-primary-600">Inicio</a>
              <a href="/nosotros" className="text-gray-700 hover:text-primary-600">Sobre Nosotros</a>
              <a href="/eventos" className="text-gray-700 hover:text-primary-600">Eventos</a>
              <a href="/donar" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">💝 Donar</a>
              <a href="/contacto" className="text-gray-700 hover:text-primary-600">Contacto</a>
              <a
                href="/auth/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Iniciar Sesión
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Protegemos y rescatamos</span>
            <span className="block text-primary-600">animales en Argentina</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Fundación Paz Animal es una ONG dedicada a la protección, rescate y cuidado de animales en situación de vulnerabilidad en Corrientes, Argentina.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <a
                href="#"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
              >
                Donar Ahora
              </a>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <a
                href="#"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Conoce Más
              </a>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                      <span className="text-2xl">🏥</span>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                    Atención Veterinaria
                  </h3>
                  <p className="mt-5 text-base text-gray-500">
                    Brindamos atención médica especializada a animales rescatados y de la comunidad.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                      <span className="text-2xl">🏠</span>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                    Refugio Temporal
                  </h3>
                  <p className="mt-5 text-base text-gray-500">
                    Proporcionamos hogar temporal seguro mientras buscamos familias adoptivas.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                      <span className="text-2xl">❤️</span>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                    Adopciones Responsables
                  </h3>
                  <p className="mt-5 text-base text-gray-500">
                    Facilitamos adopciones responsables con seguimiento post-adopción.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-24 bg-white rounded-2xl shadow-xl">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Nuestro Impacto en Números
              </h2>
              <p className="mt-3 text-xl text-gray-500 sm:mt-4">
                Desde 2020, hemos trabajado incansablemente por el bienestar animal
              </p>
            </div>
            <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
              <div className="flex flex-col">
                <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                  Animales Rescatados
                </dt>
                <dd className="order-1 text-5xl font-extrabold text-primary-600">
                  500+
                </dd>
              </div>
              <div className="flex flex-col mt-10 sm:mt-0">
                <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                  Adopciones Exitosas
                </dt>
                <dd className="order-1 text-5xl font-extrabold text-primary-600">
                  350+
                </dd>
              </div>
              <div className="flex flex-col mt-10 sm:mt-0">
                <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                  Voluntarios Activos
                </dt>
                <dd className="order-1 text-5xl font-extrabold text-primary-600">
                  50+
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <span className="mr-2">🚀</span>
            Sprint 2 Completado - CMS + SEO + Eventos + Contacto funcionando
          </div>
        </div>

        {/* Donation CTA */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg shadow-xl">
            <div className="px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-extrabold text-white">
                  Ayúdanos a Salvar Más Vidas
                </h2>
                <p className="mt-4 text-lg text-primary-100">
                  Tu donación nos permite continuar rescatando, curando y encontrando hogares para animales en situación de vulnerabilidad.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/donar"
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 transition-colors"
                  >
                    💝 Hacer una Donación
                  </a>
                  <a
                    href="/nosotros"
                    className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-primary-700 transition-colors"
                  >
                    Conocer Más
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 mt-24">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">Fundación Paz Animal</h3>
            <p className="mt-2 text-gray-600">Corrientes, Argentina</p>
            <p className="mt-1 text-gray-600">Protegiendo animales desde 2020</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
