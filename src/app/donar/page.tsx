'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'

interface DonacionFormData {
  monto: number
  donante: string
  email: string
  telefono: string
  mensaje: string
  esAnonima: boolean
}

const MONTOS_SUGERIDOS = [500, 1000, 2500, 5000, 10000]

export default function DonarPage() {
  const { data: session } = useSession()
  const [formData, setFormData] = useState<DonacionFormData>({
    monto: 1000,
    donante: session?.user?.name || '',
    email: session?.user?.email || '',
    telefono: '',
    mensaje: '',
    esAnonima: false
  })
  const [montoPersonalizado, setMontoPersonalizado] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleMontoSugerido = (monto: number) => {
    setFormData(prev => ({ ...prev, monto }))
    setMontoPersonalizado(false)
  }

  const handleMontoPersonalizado = (valor: string) => {
    const monto = parseInt(valor) || 0
    setFormData(prev => ({ ...prev, monto }))
    setMontoPersonalizado(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (formData.monto < 100) {
        throw new Error('El monto mínimo de donación es $100')
      }

      const response = await fetch('/api/donaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          usuarioId: session?.user?.id
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al procesar la donación')
      }

      const { checkoutUrl } = await response.json()

      // Redirigir a MercadoPago
      window.location.href = checkoutUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Hacer una Donación
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Tu donación nos ayuda a seguir rescatando, cuidando y protegiendo a los animales que más lo necesitan.
            </p>
          </div>
        </div>
      </div>

      {/* Donation Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Información de la Donación
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Monto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Monto de la donación *
                  </label>

                  {/* Montos sugeridos */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
                    {MONTOS_SUGERIDOS.map((monto) => (
                      <button
                        key={monto}
                        type="button"
                        onClick={() => handleMontoSugerido(monto)}
                        className={`p-3 text-center rounded-lg border-2 transition-colors ${
                          formData.monto === monto && !montoPersonalizado
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-300 hover:border-primary-300'
                        }`}
                      >
                        ${monto.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  {/* Monto personalizado */}
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">$</span>
                    <input
                      type="number"
                      min="100"
                      value={formData.monto}
                      onChange={(e) => handleMontoPersonalizado(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Ingresa otro monto"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Monto mínimo: $100
                  </p>
                </div>

                {/* Datos del donante */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Información personal
                  </h3>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="esAnonima"
                      checked={formData.esAnonima}
                      onChange={(e) => setFormData(prev => ({ ...prev, esAnonima: e.target.checked }))}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="esAnonima" className="ml-2 text-sm text-gray-700">
                      Donación anónima
                    </label>
                  </div>

                  {!formData.esAnonima && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="donante" className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre completo *
                          </label>
                          <input
                            type="text"
                            id="donante"
                            required={!formData.esAnonima}
                            value={formData.donante}
                            onChange={(e) => setFormData(prev => ({ ...prev, donante: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Tu nombre completo"
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            id="email"
                            required={!formData.esAnonima}
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="tu@email.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                          Teléfono (opcional)
                        </label>
                        <input
                          type="tel"
                          id="telefono"
                          value={formData.telefono}
                          onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="+54 379 123-4567"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Mensaje */}
                <div>
                  <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje (opcional)
                  </label>
                  <textarea
                    id="mensaje"
                    rows={4}
                    value={formData.mensaje}
                    onChange={(e) => setFormData(prev => ({ ...prev, mensaje: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Comparte un mensaje de apoyo (opcional)"
                  />
                </div>

                {/* Submit */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }`}
                  >
                    {loading ? 'Procesando...' : `Donar $${formData.monto.toLocaleString()}`}
                  </button>

                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Serás redirigido a MercadoPago para completar el pago de forma segura.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ¿Cómo ayuda tu donación?
              </h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 text-sm">🏥</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">Atención Veterinaria</h4>
                    <p className="text-sm text-gray-600">Tratamientos médicos, cirugías y cuidados especializados.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 text-sm">🍽️</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">Alimentación</h4>
                    <p className="text-sm text-gray-600">Comida nutritiva y suplementos para animales rescatados.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 text-sm">🏠</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">Refugio</h4>
                    <p className="text-sm text-gray-600">Mantenimiento de instalaciones y cuidado diario.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                💳 Pago Seguro
              </h3>
              <p className="text-sm text-primary-700">
                Utilizamos MercadoPago para procesar los pagos de forma segura.
                Puedes pagar con tarjeta de débito, crédito o transferencia bancaria.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
