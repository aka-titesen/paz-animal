import { actualizarVoluntario, eliminarVoluntario, obtenerVoluntario } from '@/services/voluntarios'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const voluntario = await obtenerVoluntario(id)

    if (!voluntario) {
      return NextResponse.json(
        { error: 'Voluntario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(voluntario)
  } catch (error) {
    console.error('Error en GET /api/admin/voluntarios/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await request.json()

    const voluntario = await actualizarVoluntario(id, data)

    return NextResponse.json(voluntario)
  } catch (error) {
    console.error('Error en PATCH /api/admin/voluntarios/[id]:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await eliminarVoluntario(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en DELETE /api/admin/voluntarios/[id]:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
