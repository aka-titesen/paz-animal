'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Calendar, Heart, MapPin, Search, Users } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

interface Voluntario {
  id: string
  nombre: string
  apellido: string
  email: string
  telefono?: string
  ciudad?: string
  provincia?: string
  areas: string[]
  fechaIngreso: string
  estado: string
  motivacion?: string
  fotoUrl?: string
  slug: string
  _count: {
    actividades: number
  }
}

interface FiltrosVoluntarios {
  busqueda: string
  area: string
  ciudad: string
  estado: string
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  pages: number
}

const AREAS_VOLUNTARIADO = [
  { value: 'CUIDADO_ANIMALES', label: 'Cuidado de Animales' },
  { value: 'LIMPIEZA', label: 'Limpieza' },
  { value: 'PASEOS', label: 'Paseos' },
  { value: 'SOCIALIZACION', label: 'Socialización' },
  { value: 'TRANSPORTE', label: 'Transporte' },
  { value: 'EVENTOS', label: 'Eventos' },
  { value: 'COMUNICACION', label: 'Comunicación' },
  { value: 'ADMINISTRACION', label: 'Administración' },
  { value: 'VETERINARIA', label: 'Veterinaria' },
  { value: 'MANTENIMIENTO', label: 'Mantenimiento' },
  { value: 'ADOPCIONES', label: 'Adopciones' },
  { value: 'EDUCACION', label: 'Educación' },
  { value: 'RECAUDACION', label: 'Recaudación' },
  { value: 'FOTOGRAFIA', label: 'Fotografía' }
]

const ESTADOS = [
  { value: 'ACTIVO', label: 'Activo', color: 'bg-green-100 text-green-800' },
  { value: 'INACTIVO', label: 'Inactivo', color: 'bg-gray-100 text-gray-800' },
  { value: 'SUSPENDIDO', label: 'Suspendido', color: 'bg-red-100 text-red-800' },
  { value: 'RETIRADO', label: 'Retirado', color: 'bg-purple-100 text-purple-800' }
]

export default function VoluntariosPage() {
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([])
  const [filtros, setFiltros] = useState<FiltrosVoluntarios>({
    busqueda: '',
    area: '',
    ciudad: '',
    estado: ''
  })
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  })
  const [loading, setLoading] = useState(true)
  const [estadisticas, setEstadisticas] = useState<any>(null)

  // Cargar voluntarios
  const cargarVoluntarios = useCallback(async (page: number = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        visible: 'true' // Solo mostrar voluntarios visibles
      })

      // Agregar filtros no vacíos
      Object.entries(filtros).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          params.append(key, value)
        }
      })

      const response = await fetch(`/api/voluntarios?${params}`)

      if (!response.ok) {
        throw new Error('Error al cargar voluntarios')
      }

      const data = await response.json()
      setVoluntarios(data.voluntarios)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error cargando voluntarios:', error)
    } finally {
      setLoading(false)
    }
  }, [filtros, pagination.limit])

  // Cargar estadísticas
  const cargarEstadisticas = async () => {
    try {
      const response = await fetch('/api/voluntarios?stats=true')
      if (response.ok) {
        const data = await response.json()
        setEstadisticas(data)
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error)
    }
  }

  useEffect(() => {
    cargarVoluntarios()
    cargarEstadisticas()
  }, [cargarVoluntarios])

  useEffect(() => {
    cargarVoluntarios(1)
  }, [cargarVoluntarios])

  const handleFiltroChange = (key: keyof FiltrosVoluntarios, value: string) => {
    setFiltros(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const limpiarFiltros = () => {
    setFiltros({
      busqueda: '',
      area: '',
      ciudad: '',
      estado: ''
    })
  }

  const obtenerColorEstado = (estado: string) => {
    return ESTADOS.find(e => e.value === estado)?.color || 'bg-gray-100 text-gray-800'
  }

  const obtenerLabelArea = (area: string) => {
    return AREAS_VOLUNTARIADO.find(a => a.value === area)?.label || area
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Nuestros Voluntarios
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Conoce a las personas increíbles que dedican su tiempo y amor a cuidar y proteger a los animales en nuestra fundación.
        </p>
      </div>

      {/* Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {estadisticas.totalVoluntarios}
                  </p>
                  <p className="text-sm text-gray-600">Total Voluntarios</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {estadisticas.voluntariosActivos}
                  </p>
                  <p className="text-sm text-gray-600">Activos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {estadisticas.actividadesMes}
                  </p>
                  <p className="text-sm text-gray-600">Actividades este mes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {estadisticas.ciudadesConMasVoluntarios?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Ciudades</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtrar Voluntarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Buscar</label>
              <Input
                placeholder="Nombre, email, ciudad..."
                value={filtros.busqueda}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFiltroChange('busqueda', e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Área</label>
              <Select
                value={filtros.area}
                onValueChange={(value: string) => handleFiltroChange('area', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las áreas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las áreas</SelectItem>
                  {AREAS_VOLUNTARIADO.map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Estado</label>
              <Select
                value={filtros.estado}
                onValueChange={(value: string) => handleFiltroChange('estado', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los estados</SelectItem>
                  {ESTADOS.map((estado) => (
                    <SelectItem key={estado.value} value={estado.value}>
                      {estado.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={limpiarFiltros}
                className="w-full"
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de voluntarios */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : voluntarios.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron voluntarios
            </h3>
            <p className="text-gray-600">
              No hay voluntarios que coincidan con los filtros seleccionados.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {voluntarios.map((voluntario) => (
              <Card key={voluntario.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {voluntario.fotoUrl ? (
                      <Image
                        src={voluntario.fotoUrl}
                        alt={`${voluntario.nombre} ${voluntario.apellido}`}
                        width={64}
                        height={64}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="h-8 w-8 text-green-600" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {voluntario.nombre} {voluntario.apellido}
                      </h3>

                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={obtenerColorEstado(voluntario.estado)}>
                          {ESTADOS.find(e => e.value === voluntario.estado)?.label}
                        </Badge>
                      </div>

                      {voluntario.ciudad && (
                        <div className="flex items-center text-sm text-gray-600 mt-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {voluntario.ciudad}
                          {voluntario.provincia && `, ${voluntario.provincia}`}
                        </div>
                      )}

                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        Desde {formatearFecha(voluntario.fechaIngreso)}
                      </div>

                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Heart className="h-4 w-4 mr-1" />
                        {voluntario._count.actividades} actividades
                      </div>
                    </div>
                  </div>

                  {voluntario.areas.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Áreas:</p>
                      <div className="flex flex-wrap gap-1">
                        {voluntario.areas.slice(0, 3).map((area) => (
                          <Badge key={area} variant="secondary" className="text-xs">
                            {obtenerLabelArea(area)}
                          </Badge>
                        ))}
                        {voluntario.areas.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{voluntario.areas.length - 3} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {voluntario.motivacion && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {voluntario.motivacion}
                      </p>
                    </div>
                  )}

                  <div className="mt-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open(`/voluntarios/${voluntario.slug}`, '_blank')}
                    >
                      Ver Perfil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Paginación */}
          {pagination.pages > 1 && (
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() => cargarVoluntarios(pagination.page - 1)}
              >
                Anterior
              </Button>

              {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                const page = i + 1
                return (
                  <Button
                    key={page}
                    variant={pagination.page === page ? "default" : "outline"}
                    onClick={() => cargarVoluntarios(page)}
                  >
                    {page}
                  </Button>
                )
              })}

              <Button
                variant="outline"
                disabled={pagination.page === pagination.pages}
                onClick={() => cargarVoluntarios(pagination.page + 1)}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
