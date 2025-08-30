import { crearDonacion } from '@/services/donaciones'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Schema de validación para crear donación
const crearDonacionSchema = z.object({
  monto: z.number().min(100, 'El monto mínimo es $100').max(1000000, 'El monto máximo es $1.000.000'),
  donante: z.string().optional(),
  email: z.string().email('Email inválido').optional(),
  telefono: z.string().optional(),
  mensaje: z.string().optional(),
  esAnonima: z.boolean(),
  usuarioId: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos de entrada
    const validatedData = crearDonacionSchema.parse(body)

    // Validaciones adicionales
    if (!validatedData.esAnonima) {
      if (!validatedData.donante || !validatedData.email) {
        return NextResponse.json(
          { error: 'Nombre y email son requeridos para donaciones no anónimas' },
          { status: 400 }
        )
      }
    }

    // Crear donación y preferencia de pago
    const resultado = await crearDonacion(validatedData)

    return NextResponse.json({
      success: true,
      donacionId: resultado.donacion.id,
      checkoutUrl: resultado.checkoutUrl,
      externalReference: resultado.donacion.externalReference
    })

  } catch (error) {
    console.error('Error in POST /api/donaciones:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Esta ruta será para obtener estadísticas o listado de donaciones (solo admin)
    // Por ahora retornamos un mensaje de no implementado
    return NextResponse.json({
      message: 'Endpoint para listar donaciones - solo admin'
    }, { status: 200 })

  } catch (error) {
    console.error('Error in GET /api/donaciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
