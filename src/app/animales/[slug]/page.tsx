import SolicitudAdopcionForm from '@/components/SolicitudAdopcionForm'
import { obtenerAnimal } from '@/services/animales'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function AnimalPage({ params }: PageProps) {
  const animal = await obtenerAnimal(params.slug)

  if (!animal) {
    notFound()
  }

  const getEspecieIcon = (especie: string) => {
    switch (especie) {
      case 'PERRO': return '🐕'
      case 'GATO': return '🐱'
      case 'CONEJO': return '🐰'
      case 'AVE': return '🐦'
      default: return '🐾'
    }
  }

  const formatearEdad = (edad?: number | null, edadTexto?: string | null) => {
    if (edadTexto) return edadTexto
    if (!edad) return 'Edad desconocida'

    if (edad < 12) {
      return `${edad} ${edad === 1 ? 'mes' : 'meses'}`
    } else {
      const años = Math.floor(edad / 12)
      const meses = edad % 12
      return `${años} ${años === 1 ? 'año' : 'años'}${meses > 0 ? ` y ${meses} ${meses === 1 ? 'mes' : 'meses'}` : ''}`
    }
  }

  const formatearTamano = (tamano?: string) => {
    const tamanos: Record<string, string> = {
      'PEQUENO': 'Pequeño',
      'MEDIANO': 'Mediano',
      'GRANDE': 'Grande',
      'GIGANTE': 'Gigante'
    }
    return tamano ? tamanos[tamano] : 'No especificado'
  }

  const formatearEstado = (estado: string) => {
    const estados: Record<string, { label: string; color: string }> = {
      'EN_REFUGIO': { label: 'En el refugio', color: 'bg-green-100 text-green-800' },
      'EN_ADOPCION': { label: 'En proceso de adopción', color: 'bg-yellow-100 text-yellow-800' },
      'ADOPTADO': { label: 'Adoptado', color: 'bg-blue-100 text-blue-800' },
      'EN_TRATAMIENTO': { label: 'En tratamiento', color: 'bg-red-100 text-red-800' },
      'CUARENTENA': { label: 'En cuarentena', color: 'bg-orange-100 text-orange-800' }
    }
    return estados[estado] || { label: estado, color: 'bg-gray-100 text-gray-800' }
  }

  const estadoInfo = formatearEstado(animal.estado)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex space-x-4 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Inicio</Link>
            <span className="text-gray-400">/</span>
            <Link href="/animales" className="text-gray-500 hover:text-gray-700">Animales</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{animal.nombre}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galería de Fotos */}
          <div className="space-y-4">
            {animal.fotos && animal.fotos.length > 0 ? (
              <>
                <div className="relative h-96 rounded-lg overflow-hidden">
                  <Image
                    src={animal.fotos[0]!.url}
                    alt={animal.fotos[0]!.alt || `Foto principal de ${animal.nombre}`}
                    fill
                    className="object-cover"
                  />
                </div>

                {animal.fotos.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {animal.fotos.slice(1, 5).map((foto: any, index: number) => (
                      <div key={index} className="relative h-20 rounded-md overflow-hidden">
                        <Image
                          src={foto.url}
                          alt={foto.alt || `Foto ${index + 2} de ${animal.nombre}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-6xl">{getEspecieIcon(animal.especie)}</span>
              </div>
            )}
          </div>

          {/* Información del Animal */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {animal.nombre} {getEspecieIcon(animal.especie)}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${estadoInfo.color}`}>
                  {estadoInfo.label}
                </span>
              </div>

              {animal.descripcion && (
                <p className="text-lg text-gray-600 mb-6">
                  {animal.descripcion}
                </p>
              )}
            </div>

            {/* Información Básica */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Información Básica
              </h2>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Especie:</span>
                  <p className="text-gray-900">{animal.especie}</p>
                </div>

                {animal.raza && (
                  <div>
                    <span className="font-medium text-gray-700">Raza:</span>
                    <p className="text-gray-900">{animal.raza}</p>
                  </div>
                )}

                <div>
                  <span className="font-medium text-gray-700">Edad:</span>
                  <p className="text-gray-900">{formatearEdad(animal.edad, animal.edadTexto)}</p>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Sexo:</span>
                  <p className="text-gray-900">{animal.sexo}</p>
                </div>

                {animal.tamano && (
                  <div>
                    <span className="font-medium text-gray-700">Tamaño:</span>
                    <p className="text-gray-900">{formatearTamano(animal.tamano)}</p>
                  </div>
                )}

                {animal.color && (
                  <div>
                    <span className="font-medium text-gray-700">Color:</span>
                    <p className="text-gray-900">{animal.color}</p>
                  </div>
                )}

                {animal.peso && (
                  <div>
                    <span className="font-medium text-gray-700">Peso:</span>
                    <p className="text-gray-900">{animal.peso.toString()} kg</p>
                  </div>
                )}
              </div>
            </div>

            {/* Estado de Salud */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Estado de Salud
              </h2>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    animal.esterilizado ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {animal.esterilizado ? '✓' : '✗'}
                  </div>
                  <p className="text-sm font-medium">Esterilizado</p>
                </div>

                <div className="text-center">
                  <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    animal.vacunado ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {animal.vacunado ? '✓' : '✗'}
                  </div>
                  <p className="text-sm font-medium">Vacunado</p>
                </div>

                <div className="text-center">
                  <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    animal.desparasitado ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {animal.desparasitado ? '✓' : '✗'}
                  </div>
                  <p className="text-sm font-medium">Desparasitado</p>
                </div>
              </div>
            </div>

            {/* Personalidad */}
            {animal.personalidad && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Personalidad
                </h2>
                <p className="text-gray-700">
                  {animal.personalidad}
                </p>
              </div>
            )}

            {/* Cuidados Especiales */}
            {animal.cuidadosEspeciales && (
              <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                <h2 className="text-lg font-semibold text-yellow-800 mb-4">
                  Cuidados Especiales
                </h2>
                <p className="text-yellow-700">
                  {animal.cuidadosEspeciales}
                </p>
              </div>
            )}

            {/* Historia de Rescate */}
            {animal.historiaRescate && (
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h2 className="text-lg font-semibold text-blue-800 mb-4">
                  Su Historia
                </h2>
                <p className="text-blue-700">
                  {animal.historiaRescate}
                </p>
              </div>
            )}

            {/* Botón de Adopción */}
            {animal.disponibleAdopcion && animal.estado === 'EN_REFUGIO' && (
              <div className="bg-primary-50 rounded-lg p-6 border border-primary-200">
                <h2 className="text-lg font-semibold text-primary-800 mb-4">
                  ¿Quieres adoptarme?
                </h2>
                <p className="text-primary-700 mb-4">
                  Si estás interesado en adoptar a {animal.nombre}, puedes llenar el formulario de solicitud.
                </p>
                <SolicitudAdopcionForm animalId={animal.id} animalNombre={animal.nombre} />
              </div>
            )}

            {/* Información de Contacto */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Información de Contacto
              </h2>
              <p className="text-gray-700 mb-4">
                Para más información sobre {animal.nombre}, puedes contactarnos:
              </p>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Email:</span> adopciones@pazanimal.org</p>
                <p><span className="font-medium">Teléfono:</span> +54 379 123-4567</p>
                <p><span className="font-medium">Dirección:</span> Av. Libertad 123, Corrientes Capital</p>
                <p><span className="font-medium">Horarios:</span> Lunes a Viernes 9:00 - 17:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
