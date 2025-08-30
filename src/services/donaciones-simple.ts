import { prisma } from '@/lib/prisma'

export interface CrearDonacionData {
  monto: number
  donante?: string
  email?: string
  telefono?: string
  mensaje?: string
  esAnonima?: boolean
  usuarioId?: string
}

export async function crearDonacion(data: CrearDonacionData) {
  try {
    // Generar referencia externa única
    const externalReference = `DON-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Crear la donación en la base de datos
    const donacion = await prisma.donacion.create({
      data: {
        monto: data.monto,
        moneda: 'ARS',
        estado: 'PENDIENTE',
        donante: data.donante,
        email: data.email,
        telefono: data.telefono,
        mensaje: data.mensaje,
        esAnonima: data.esAnonima || false,
        externalReference,
        userId: data.usuarioId
      }
    })

    return {
      donacion,
      paymentUrl: '#' // Placeholder para la URL de pago
    }
  } catch (error) {
    console.error('Error creating donation:', error)
    throw new Error('Error al crear la donación')
  }
}

export async function obtenerDonacion(id: string) {
  try {
    const donacion = await prisma.donacion.findUnique({
      where: { id }
    })

    return donacion
  } catch (error) {
    console.error('Error fetching donation:', error)
    throw new Error('Error al obtener la donación')
  }
}

export async function actualizarEstadoDonacion(paymentData: any) {
  try {
    let estado = 'PENDIENTE'

    switch (paymentData.status) {
      case 'approved':
        estado = 'APROBADA'
        break
      case 'pending':
        estado = 'PENDIENTE'
        break
      case 'rejected':
        estado = 'RECHAZADA'
        break
      case 'cancelled':
        estado = 'CANCELADA'
        break
      default:
        estado = 'PENDIENTE'
    }

    const donacionActualizada = await prisma.donacion.update({
      where: { paymentId: paymentData.id.toString() },
      data: {
        estado,
        fechaPago: estado === 'APROBADA' ? new Date() : null,
        metodoPago: paymentData.payment_method?.type
      }
    })

    return donacionActualizada
  } catch (error) {
    console.error('Error updating donation status:', error)
    throw new Error('Error al actualizar el estado de la donación')
  }
}
