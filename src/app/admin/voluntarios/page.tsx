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
import {
    Activity,
    Download,
    Edit,
    Eye,
    EyeOff,
    Filter,
    Plus,
    QrCode,
    Trash2,
    Users
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface Voluntario {
  id: string
  nombre: string
  apellido: string
  email: string
  telefono?: string
  ciudad?: string
  areas: string[]
  fechaIngreso: string
  estado: string
  visible: boolean
  _count: {
    actividades: number
  }
}

interface Filtros {
  busqueda: string
  area: string
  ciudad: string
  estado: string
  visible: string
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

export default function AdminVoluntariosPage() {
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([])
  const [filtros, setFiltros] = useState<Filtros>({
    busqueda: '',
    area: '',
    ciudad: '',
    estado: '',
    visible: ''
  })
  const [loading, setLoading] = useState(true)
  const [selectedVoluntarios, setSelectedVoluntarios] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const cargarVoluntarios = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      // Agregar filtros no vacíos
      Object.entries(filtros).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          params.append(key, value)
        }
      })

      const response = await fetch(`/api/admin/voluntarios?${params}`)

      if (response.ok) {
        const data = await response.json()
        setVoluntarios(data.voluntarios)
      }
    } catch (error) {
      console.error('Error cargando voluntarios:', error)
    } finally {
      setLoading(false)
    }
  }, [filtros])

  useEffect(() => {
    cargarVoluntarios()
  }, [cargarVoluntarios])

  const handleFiltroChange = (key: keyof Filtros, value: string) => {
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
      estado: '',
      visible: ''
    })
  }

  const toggleVisibilidad = async (id: string, visible: boolean) => {
    try {
      const response = await fetch(`/api/admin/voluntarios/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !visible })
      })

      if (response.ok) {
        await cargarVoluntarios()
      }
    } catch (error) {
      console.error('Error cambiando visibilidad:', error)
    }
  }

  const eliminarVoluntario = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este voluntario?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/voluntarios/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await cargarVoluntarios()
      }
    } catch (error) {
      console.error('Error eliminando voluntario:', error)
    }
  }

  const handleSelectVoluntario = (id: string) => {
    setSelectedVoluntarios(prev =>
      prev.includes(id)
        ? prev.filter(v => v !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedVoluntarios.length === voluntarios.length) {
      setSelectedVoluntarios([])
    } else {
      setSelectedVoluntarios(voluntarios.map(v => v.id))
    }
  }

  const exportarVoluntarios = async () => {
    try {
      const response = await fetch('/api/admin/voluntarios/export')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `voluntarios_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error exportando voluntarios:', error)
    }
  }

  const obtenerColorEstado = (estado: string) => {
    return ESTADOS.find(e => e.value === estado)?.color || 'bg-gray-100 text-gray-800'
  }

  const obtenerLabelArea = (area: string) => {
    return AREAS_VOLUNTARIADO.find(a => a.value === area)?.label || area
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Voluntarios
          </h1>
          <p className="text-gray-600 mt-2">
            Administra voluntarios, actividades y horarios
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={exportarVoluntarios} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setShowFilters(!showFilters)} variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button onClick={() => window.open('/admin/voluntarios/nuevo', '_blank')}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Voluntario
          </Button>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              <Input
                placeholder="Buscar..."
                value={filtros.busqueda}
                onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
              />

              <Select
                value={filtros.area}
                onValueChange={(value) => handleFiltroChange('area', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Área" />
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

              <Input
                placeholder="Ciudad"
                value={filtros.ciudad}
                onChange={(e) => handleFiltroChange('ciudad', e.target.value)}
              />

              <Select
                value={filtros.estado}
                onValueChange={(value) => handleFiltroChange('estado', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
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

              <Select
                value={filtros.visible}
                onValueChange={(value) => handleFiltroChange('visible', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Visibilidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="true">Visibles</SelectItem>
                  <SelectItem value="false">Ocultos</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={limpiarFiltros} variant="outline">
                Limpiar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Acciones masivas */}
      {selectedVoluntarios.length > 0 && (
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {selectedVoluntarios.length} voluntario(s) seleccionado(s)
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedVoluntarios([])}
              >
                Deseleccionar todos
              </Button>
              <Button size="sm" variant="destructive">
                Eliminar seleccionados
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabla de voluntarios */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedVoluntarios.length === voluntarios.length && voluntarios.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="p-4 text-left font-semibold">Voluntario</th>
                  <th className="p-4 text-left font-semibold">Contacto</th>
                  <th className="p-4 text-left font-semibold">Áreas</th>
                  <th className="p-4 text-left font-semibold">Estado</th>
                  <th className="p-4 text-left font-semibold">Actividades</th>
                  <th className="p-4 text-left font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b animate-pulse">
                      <td className="p-4">
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      </td>
                      <td className="p-4">
                        <div className="w-32 h-4 bg-gray-300 rounded"></div>
                      </td>
                      <td className="p-4">
                        <div className="w-24 h-4 bg-gray-300 rounded"></div>
                      </td>
                      <td className="p-4">
                        <div className="w-20 h-4 bg-gray-300 rounded"></div>
                      </td>
                      <td className="p-4">
                        <div className="w-16 h-4 bg-gray-300 rounded"></div>
                      </td>
                      <td className="p-4">
                        <div className="w-12 h-4 bg-gray-300 rounded"></div>
                      </td>
                      <td className="p-4">
                        <div className="w-20 h-4 bg-gray-300 rounded"></div>
                      </td>
                    </tr>
                  ))
                ) : voluntarios.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      No se encontraron voluntarios
                    </td>
                  </tr>
                ) : (
                  voluntarios.map((voluntario) => (
                    <tr key={voluntario.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedVoluntarios.includes(voluntario.id)}
                          onChange={() => handleSelectVoluntario(voluntario.id)}
                          className="rounded"
                        />
                      </td>

                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {voluntario.nombre} {voluntario.apellido}
                          </div>
                          <div className="text-sm text-gray-500">
                            {voluntario.ciudad}
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="text-sm">
                          <div>{voluntario.email}</div>
                          {voluntario.telefono && (
                            <div className="text-gray-500">{voluntario.telefono}</div>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {voluntario.areas.slice(0, 2).map((area) => (
                            <Badge key={area} variant="secondary" className="text-xs">
                              {obtenerLabelArea(area)}
                            </Badge>
                          ))}
                          {voluntario.areas.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{voluntario.areas.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <Badge className={obtenerColorEstado(voluntario.estado)}>
                          {ESTADOS.find(e => e.value === voluntario.estado)?.label}
                        </Badge>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Activity className="h-4 w-4" />
                          {voluntario._count.actividades}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleVisibilidad(voluntario.id, voluntario.visible)}
                            title={voluntario.visible ? 'Ocultar perfil' : 'Mostrar perfil'}
                          >
                            {voluntario.visible ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(`/voluntarios/${voluntario.id}`, '_blank')}
                            title="Ver QR"
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(`/admin/voluntarios/${voluntario.id}/editar`, '_blank')}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => eliminarVoluntario(voluntario.id)}
                            title="Eliminar"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
