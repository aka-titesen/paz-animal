import { MercadoPagoConfig, Payment, Preference } from 'mercadopago'

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  throw new Error('MERCADOPAGO_ACCESS_TOKEN is not defined in environment variables')
}

// Configuración de MercadoPago
export const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  options: {
    timeout: 5000,
    idempotencyKey: 'abc-123',
  }
})

export const preferenceClient = new Preference(mercadoPagoClient)
export const paymentClient = new Payment(mercadoPagoClient)

// Configuración de URLs
export const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXTAUTH_URL || 'https://pazanimal.org'
  }
  return 'http://localhost:3000'
}

// URLs de callback para MercadoPago
export const getCallbackUrls = (donacionId: string) => {
  const baseUrl = getBaseUrl()
  return {
    success: `${baseUrl}/donacion/exito?id=${donacionId}`,
    failure: `${baseUrl}/donacion/error?id=${donacionId}`,
    pending: `${baseUrl}/donacion/pendiente?id=${donacionId}`,
    notification: `${baseUrl}/api/webhooks/mercadopago`
  }
}

// Función para crear preferencia de pago
export interface DonacionPreference {
  monto: number
  donante?: string
  email?: string
  telefono?: string
  mensaje?: string
  esAnonima: boolean
  externalReference: string
}

export async function crearPreferenciaDonacion(data: DonacionPreference) {
  try {
    const urls = getCallbackUrls(data.externalReference)

    const preferenceData = {
      items: [
        {
          id: `donacion-${data.externalReference}`,
          title: `Donación a Fundación Paz Animal`,
          description: data.mensaje || 'Donación para apoyar el cuidado y protección de animales',
          quantity: 1,
          unit_price: data.monto,
          currency_id: 'ARS'
        }
      ],
      payer: {
        name: data.donante || 'Donante Anónimo',
        email: data.email || 'donante@pazanimal.org',
        phone: data.telefono ? {
          area_code: '379',
          number: data.telefono
        } : undefined
      },
      back_urls: {
        success: urls.success,
        failure: urls.failure,
        pending: urls.pending
      },
      auto_return: 'approved',
      notification_url: urls.notification,
      external_reference: data.externalReference,
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12 // Permitir hasta 12 cuotas
      },
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)).toISOString() // 7 días
    }

    const preference = await preferenceClient.create({ body: preferenceData })

    return {
      id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
      preferenceData: preference
    }
  } catch (error) {
    console.error('Error creating MercadoPago preference:', error)
    throw new Error('Error al crear la preferencia de pago')
  }
}

// Función para verificar pago
export async function verificarPago(paymentId: string) {
  try {
    const payment = await paymentClient.get({ id: paymentId })
    return payment
  } catch (error) {
    console.error('Error verifying payment:', error)
    throw new Error('Error al verificar el pago')
  }
}
