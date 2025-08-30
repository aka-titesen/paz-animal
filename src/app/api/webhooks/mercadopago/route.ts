import { verificarPago } from '@/lib/mercadopago'
import { actualizarEstadoDonacion } from '@/services/donaciones'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('MercadoPago webhook received:', body)

    // Verificar que es una notificación de payment
    if (body.type !== 'payment') {
      console.log('Webhook type not supported:', body.type)
      return NextResponse.json({ message: 'Webhook type not supported' }, { status: 200 })
    }

    // Obtener el ID del pago
    const paymentId = body.data?.id
    if (!paymentId) {
      console.log('Payment ID not found in webhook')
      return NextResponse.json({ error: 'Payment ID not found' }, { status: 400 })
    }

    // Verificar el pago con MercadoPago
    const paymentData = await verificarPago(paymentId)
    console.log('Payment data from MercadoPago:', paymentData)

    // Actualizar estado de la donación
    const donacionActualizada = await actualizarEstadoDonacion(paymentData)
    console.log('Donation updated:', donacionActualizada.id, donacionActualizada.estado)

    // TODO: Enviar email de confirmación si el pago fue aprobado
    if (donacionActualizada.estado === 'APROBADA') {
      console.log('Payment approved, should send confirmation email')
      // await enviarEmailConfirmacion(donacionActualizada)
    }

    return NextResponse.json({
      message: 'Webhook processed successfully',
      donacionId: donacionActualizada.id,
      estado: donacionActualizada.estado
    })

  } catch (error) {
    console.error('Error processing MercadoPago webhook:', error)

    // Importante: siempre retornar 200 para que MercadoPago no reintente indefinidamente
    // En caso de error real, registrar para revisión manual
    return NextResponse.json(
      { error: 'Error processing webhook', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 200 }
    )
  }
}

// Método GET para verificar que el endpoint está disponible
export async function GET() {
  return NextResponse.json({
    message: 'MercadoPago webhook endpoint is active',
    timestamp: new Date().toISOString()
  })
}
