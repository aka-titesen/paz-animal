import {
    actualizarVoluntario,
    eliminarVoluntario,
    obtenerVoluntario
} from '@/services/voluntarios'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Esquema de validación para actualizar voluntario
const actualizarVoluntarioSchema = z.object({
  nombre: z.string().min(2).optional(),
  apellido: z.string().min(2).optional(),
  email: z.string().email().optional(),
  telefono: z.string().optional(),
  whatsapp: z.string().optional(),
  fechaNacimiento: z.string().datetime().optional(),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  provincia: z.string().optional(),
  codigoPostal: z.string().optional(),
  dni: z.string().optional(),
  cuil: z.string().optional(),
  motivacion: z.string().optional(),
  experiencia: z.string().optional(),
  disponibilidad: z.string().optional(),
  habilidades: z.string().optional(),
  areas: z.array(z.enum([
    'CUIDADO_ANIMALES', 'LIMPIEZA', 'PASEOS', 'SOCIALIZACION', 'TRANSPORTE',
    'EVENTOS', 'COMUNICACION', 'ADMINISTRACION', 'VETERINARIA',
    'MANTENIMIENTO', 'ADOPCIONES', 'EDUCACION', 'RECAUDACION', 'FOTOGRAFIA'
  ])).optional(),
  fotoUrl: z.string().url().optional(),
  visible: z.boolean().optional(),
  estado: z.enum(['ACTIVO', 'INACTIVO', 'SUSPENDIDO', 'RETIRADO']).optional()
})

// GET /api/voluntarios/[id] - Obtener voluntario por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const voluntario = await obtenerVoluntario(params.id)
    return NextResponse.json(voluntario)
  } catch (error) {
    console.error('Error in GET /api/voluntarios/[id]:', error)

    if (error instanceof Error && error.message === 'Voluntario no encontrado') {
      return NextResponse.json(
        { error: 'Voluntario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Error al obtener el voluntario' },
      { status: 500 }
    )
  }
}

// PUT /api/voluntarios/[id] - Actualizar voluntario
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Implementar autenticación cuando esté configurada
    // const session = await auth()

    // if (!session?.user?.id) {
    //   return NextResponse.json(
    //     { error: 'No autorizado' },
    //     { status: 401 }
    //   )
    // }

    const body = await request.json()

    // Validar datos
    const validatedData = actualizarVoluntarioSchema.parse(body)

    // Convertir fecha si existe
    const datosActualizacion = {
      ...validatedData,
      fechaNacimiento: validatedData.fechaNacimiento ?
        validatedData.fechaNacimiento : undefined
    }

    const voluntario = await actualizarVoluntario(
      params.id,
      datosActualizacion
    )

    return NextResponse.json(voluntario)
  } catch (error) {
    console.error('Error in PUT /api/voluntarios/[id]:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message === 'Voluntario no encontrado') {
      return NextResponse.json(
        { error: 'Voluntario no encontrado' },
        { status: 404 }
      )
    }

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Ya existe un voluntario con ese email o DNI' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Error al actualizar el voluntario' },
      { status: 500 }
    )
  }
}

// DELETE /api/voluntarios/[id] - Eliminar voluntario
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Implementar autenticación cuando esté configurada
    // const session = await auth()

    // if (!session?.user?.id) {
    //   return NextResponse.json(
    //     { error: 'No autorizado' },
    //     { status: 401 }
    //   )
    // }

    await eliminarVoluntario(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/voluntarios/[id]:', error)

    if (error instanceof Error && error.message === 'Voluntario no encontrado') {
      return NextResponse.json(
        { error: 'Voluntario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Error al eliminar el voluntario' },
      { status: 500 }
    )
  }
}
