import {
    crearVoluntario,
    listarVoluntarios,
    obtenerEstadisticasVoluntarios
} from '@/services/voluntarios'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Esquema de validación para crear voluntario
const crearVoluntarioSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().optional(),
  whatsapp: z.string().optional(),
  fechaNacimiento: z.string().datetime().optional(),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  provincia: z.string().optional(),
  pais: z.string().default('Argentina'),
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
  ])).min(1, 'Debe seleccionar al menos un área'),
  fotoUrl: z.string().url().optional(),
  visible: z.boolean().optional()
})

// GET /api/voluntarios - Listar voluntarios con filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const nombre = searchParams.get('nombre') && searchParams.get('nombre') !== 'undefined' ? searchParams.get('nombre') : undefined
    const email = searchParams.get('email') && searchParams.get('email') !== 'undefined' ? searchParams.get('email') : undefined
    const estado = searchParams.get('estado') && searchParams.get('estado') !== 'undefined' ? searchParams.get('estado') : undefined
    const area = searchParams.get('area') && searchParams.get('area') !== 'undefined' ? searchParams.get('area') : undefined
    const ciudad = searchParams.get('ciudad') && searchParams.get('ciudad') !== 'undefined' ? searchParams.get('ciudad') : undefined
    const visible = searchParams.get('visible') === 'true' ? true :
                    searchParams.get('visible') === 'false' ? false : undefined
    const busqueda = searchParams.get('busqueda') && searchParams.get('busqueda') !== 'undefined' ? searchParams.get('busqueda') : undefined
    const stats = searchParams.get('stats') === 'true'

    // Si se solicitan estadísticas
    if (stats) {
      const estadisticas = await obtenerEstadisticasVoluntarios()
      return NextResponse.json(estadisticas)
    }

    const filtros = {
      nombre: nombre || undefined,
      email: email || undefined,
      estado: estado || undefined,
      area: area || undefined,
      ciudad: ciudad || undefined,
      visible,
      busqueda: busqueda || undefined
    }

    const resultado = await listarVoluntarios(filtros, page, limit)

    return NextResponse.json(resultado)
  } catch (error) {
    console.error('Error in GET /api/voluntarios:', error)
    return NextResponse.json(
      { error: 'Error al obtener la lista de voluntarios' },
      { status: 500 }
    )
  }
}

// POST /api/voluntarios - Crear nuevo voluntario
export async function POST(request: NextRequest) {
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
    const validatedData = crearVoluntarioSchema.parse(body)

    // Convertir fecha si existe
    const datosVoluntario = {
      ...validatedData,
      fechaNacimiento: validatedData.fechaNacimiento ?
        validatedData.fechaNacimiento : undefined
    }

    const voluntario = await crearVoluntario(datosVoluntario)

    return NextResponse.json(voluntario, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/voluntarios:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Ya existe un voluntario con ese email o DNI' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Error al crear el voluntario' },
      { status: 500 }
    )
  }
}
