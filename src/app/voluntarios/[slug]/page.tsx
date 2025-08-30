'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Activity,
    Award,
    Calendar,
    Clock,
    Heart,
    Mail,
    MapPin,
    Phone,
    QrCode,
    User
} from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Voluntario {
  id: string
  nombre: string
  apellido: string
  email: string
  telefono?: string
  fechaNacimiento?: string
  ciudad?: string
  provincia?: string
  pais?: string
  direccion?: string
  areas: string[]
  fechaIngreso: string
  estado: string
  motivacion?: string
  experienciaPrevia?: string
  disponibilidad: string
  emergenciaContacto?: string
  emergenciaTelefono?: string
  observaciones?: string
  fotoUrl?: string
  slug: string
  qrCode: string
  _count: {
    actividades: number
  }
  actividades: {
    id: string
    tipo: string
    descripcion: string
    fechaInicio: Date
    fechaFin?: Date
    estado: string
    observaciones?: string
  }[]
}

const AREAS_VOLUNTARIADO = [
  { value: 'CUIDADO_ANIMALES', label: 'Cuidado de Animales', icon: '🐕' },
  { value: 'LIMPIEZA', label: 'Limpieza', icon: '🧹' },
  { value: 'PASEOS', label: 'Paseos', icon: '🚶' },
  { value: 'SOCIALIZACION', label: 'Socialización', icon: '🤝' },
  { value: 'TRANSPORTE', label: 'Transporte', icon: '🚗' },
  { value: 'EVENTOS', label: 'Eventos', icon: '🎪' },
  { value: 'COMUNICACION', label: 'Comunicación', icon: '📢' },
  { value: 'ADMINISTRACION', label: 'Administración', icon: '📋' },
  { value: 'VETERINARIA', label: 'Veterinaria', icon: '🏥' },
  { value: 'MANTENIMIENTO', label: 'Mantenimiento', icon: '🔧' },
  { value: 'ADOPCIONES', label: 'Adopciones', icon: '💝' },
  { value: 'EDUCACION', label: 'Educación', icon: '📚' },
  { value: 'RECAUDACION', label: 'Recaudación', icon: '💰' },
  { value: 'FOTOGRAFIA', label: 'Fotografía', icon: '📸' }
]

const ESTADOS = [
  { value: 'ACTIVO', label: 'Activo', color: 'bg-green-100 text-green-800' },
  { value: 'INACTIVO', label: 'Inactivo', color: 'bg-gray-100 text-gray-800' },
  { value: 'SUSPENDIDO', label: 'Suspendido', color: 'bg-red-100 text-red-800' },
  { value: 'RETIRADO', label: 'Retirado', color: 'bg-purple-100 text-purple-800' }
]

const TIPOS_ACTIVIDAD = [
  { value: 'PASEO', label: 'Paseo' },
  { value: 'LIMPIEZA', label: 'Limpieza' },
  { value: 'ALIMENTACION', label: 'Alimentación' },
  { value: 'CUIDADO_MEDICO', label: 'Cuidado Médico' },
  { value: 'SOCIALIZACION', label: 'Socialización' },
  { value: 'TRANSPORTE', label: 'Transporte' },
  { value: 'EVENTO', label: 'Evento' },
  { value: 'MANTENIMIENTO', label: 'Mantenimiento' },
  { value: 'ADMINISTRACION', label: 'Administración' },
  { value: 'OTRO', label: 'Otro' }
]

export default function VoluntarioPerfilPage() {
  const params = useParams()
  const [voluntario, setVoluntario] = useState<Voluntario | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showQr, setShowQr] = useState(false)

  useEffect(() => {
    if (params.slug) {
      cargarVoluntario(params.slug as string)
    }
  }, [params.slug])

  const cargarVoluntario = async (slug: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/voluntarios/perfil/${slug}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Voluntario no encontrado')
        }
        throw new Error('Error al cargar el perfil del voluntario')
      }

      const data = await response.json()
      setVoluntario(data)
    } catch (error) {
      console.error('Error cargando voluntario:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const obtenerColorEstado = (estado: string) => {
    return ESTADOS.find(e => e.value === estado)?.color || 'bg-gray-100 text-gray-800'
  }

  const obtenerLabelArea = (area: string) => {
    return AREAS_VOLUNTARIADO.find(a => a.value === area)?.label || area
  }

  const obtenerIconoArea = (area: string) => {
    return AREAS_VOLUNTARIADO.find(a => a.value === area)?.icon || '📋'
  }

  const obtenerLabelTipoActividad = (tipo: string) => {
    return TIPOS_ACTIVIDAD.find(t => t.value === tipo)?.label || tipo
  }

  const formatearFecha = (fecha: string | Date) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date()
    const nacimiento = new Date(fechaNacimiento)
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const mes = hoy.getMonth() - nacimiento.getMonth()

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--
    }

    return edad
  }

  const calcularTiempoVoluntariado = (fechaIngreso: string) => {
    const ingreso = new Date(fechaIngreso)
    const hoy = new Date()
    const diffTime = Math.abs(hoy.getTime() - ingreso.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 30) {
      return `${diffDays} días`
    } else if (diffDays < 365) {
      const meses = Math.floor(diffDays / 30)
      return `${meses} mes${meses > 1 ? 'es' : ''}`
    } else {
      const años = Math.floor(diffDays / 365)
      const mesesRestantes = Math.floor((diffDays % 365) / 30)
      return `${años} año${años > 1 ? 's' : ''}${mesesRestantes > 0 ? ` y ${mesesRestantes} mes${mesesRestantes > 1 ? 'es' : ''}` : ''}`
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-48 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-300 h-32 rounded-lg"></div>
                <div className="bg-gray-300 h-64 rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-300 h-48 rounded-lg"></div>
                <div className="bg-gray-300 h-32 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <User className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-900 mb-2">
              {error}
            </h1>
            <p className="text-red-600 mb-6">
              El perfil que buscas no está disponible o no existe.
            </p>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
            >
              Volver Atrás
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!voluntario) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header del perfil */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-blue-600 h-32"></div>
          <CardContent className="relative px-6 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
              {/* Foto del voluntario */}
              <div className="relative">
                {voluntario.fotoUrl ? (
                  <Image
                    src={voluntario.fotoUrl}
                    alt={`${voluntario.nombre} ${voluntario.apellido}`}
                    width={128}
                    height={128}
                    className="rounded-full border-4 border-white shadow-lg bg-white object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                )}

                {/* Badge de estado */}
                <div className="absolute -bottom-2 -right-2">
                  <Badge className={obtenerColorEstado(voluntario.estado)}>
                    {ESTADOS.find(e => e.value === voluntario.estado)?.label}
                  </Badge>
                </div>
              </div>

              {/* Información principal */}
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {voluntario.nombre} {voluntario.apellido}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                  {voluntario.ciudad && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {voluntario.ciudad}
                        {voluntario.provincia && `, ${voluntario.provincia}`}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Voluntario desde {formatearFecha(voluntario.fechaIngreso)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{calcularTiempoVoluntariado(voluntario.fechaIngreso)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Activity className="h-4 w-4" />
                    <span>{voluntario._count.actividades} actividades</span>
                  </div>
                </div>

                {/* Áreas de voluntariado */}
                <div className="flex flex-wrap gap-2">
                  {voluntario.areas.slice(0, 4).map((area) => (
                    <Badge key={area} variant="secondary" className="text-sm">
                      <span className="mr-1">{obtenerIconoArea(area)}</span>
                      {obtenerLabelArea(area)}
                    </Badge>
                  ))}
                  {voluntario.areas.length > 4 && (
                    <Badge variant="secondary" className="text-sm">
                      +{voluntario.areas.length - 4} más
                    </Badge>
                  )}
                </div>
              </div>

              {/* Botón QR */}
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => setShowQr(!showQr)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <QrCode className="h-4 w-4" />
                  {showQr ? 'Ocultar QR' : 'Mostrar QR'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Motivación */}
            {voluntario.motivacion && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Motivación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {voluntario.motivacion}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Experiencia previa */}
            {voluntario.experienciaPrevia && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    Experiencia Previa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {voluntario.experienciaPrevia}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Actividades recientes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Actividades Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {voluntario.actividades.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No hay actividades registradas aún.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {voluntario.actividades.slice(0, 5).map((actividad) => (
                      <div key={actividad.id} className="border-l-4 border-green-500 pl-4 py-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {obtenerLabelTipoActividad(actividad.tipo)}
                            </h4>
                            <p className="text-sm text-gray-600 mb-1">
                              {actividad.descripcion}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatearFecha(actividad.fechaInicio)}
                              {actividad.fechaFin && ` - ${formatearFecha(actividad.fechaFin)}`}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {actividad.estado}
                          </Badge>
                        </div>
                      </div>
                    ))}

                    {voluntario.actividades.length > 5 && (
                      <p className="text-sm text-gray-500 text-center pt-4">
                        Y {voluntario.actividades.length - 5} actividades más...
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Code */}
            {showQr && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <QrCode className="h-5 w-5" />
                    Código QR
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="bg-white p-4 rounded-lg border inline-block">
                    <Image
                      src={`data:image/svg+xml;base64,${Buffer.from(voluntario.qrCode).toString('base64')}`}
                      alt="Código QR del voluntario"
                      width={200}
                      height={200}
                      className="mx-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Comparte este código para acceder al perfil
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Información de contacto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {voluntario.fechaNacimiento && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {calcularEdad(voluntario.fechaNacimiento)} años
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{voluntario.email}</span>
                </div>

                {voluntario.telefono && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{voluntario.telefono}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Todas las áreas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Áreas de Voluntariado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {voluntario.areas.map((area) => (
                    <div key={area} className="flex items-center gap-2 text-sm">
                      <span className="text-lg">{obtenerIconoArea(area)}</span>
                      <span>{obtenerLabelArea(area)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Disponibilidad */}
            {voluntario.disponibilidad && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Disponibilidad</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">
                    {voluntario.disponibilidad}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
