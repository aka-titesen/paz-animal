import { listarVoluntarios, obtenerEstadisticasVoluntarios } from '@/services/voluntarios'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Si se solicitan estadísticas
    if (searchParams.get('stats') === 'true') {
      const stats = await obtenerEstadisticasVoluntarios()
      return NextResponse.json(stats)
    }

    // Parámetros de paginación
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Filtros
    const filtros = {
      busqueda: searchParams.get('busqueda') || undefined,
      area: searchParams.get('area') || undefined,
      ciudad: searchParams.get('ciudad') || undefined,
      estado: searchParams.get('estado') || undefined,
      visible: searchParams.get('visible') ? searchParams.get('visible') === 'true' : undefined
    }

    const resultado = await listarVoluntarios(filtros, page, limit)

    return NextResponse.json(resultado)
  } catch (error) {
    console.error('Error en GET /api/admin/voluntarios:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
