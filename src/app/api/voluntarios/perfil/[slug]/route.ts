import { obtenerVoluntarioPorSlug } from '@/services/voluntarios'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug del voluntario requerido' },
        { status: 400 }
      )
    }

    const voluntario = await obtenerVoluntarioPorSlug(slug)

    if (!voluntario) {
      return NextResponse.json(
        { error: 'Voluntario no encontrado' },
        { status: 404 }
      )
    }

    // Solo mostrar si el voluntario está visible al público
    if (!voluntario.visible) {
      return NextResponse.json(
        { error: 'Perfil no disponible' },
        { status: 404 }
      )
    }

    return NextResponse.json(voluntario)
  } catch (error) {
    console.error('Error en GET /api/voluntarios/perfil/[slug]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
