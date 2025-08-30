import { PrismaClient } from '@prisma/client'
import QRCode from 'qrcode'
import { z } from 'zod'

const prisma = new PrismaClient()

// Schemas de validación
export const CrearVoluntarioSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().optional(),
  fechaNacimiento: z.string().optional(),
  ciudad: z.string().optional(),
  provincia: z.string().optional(),
  pais: z.string().default('Argentina'),
  direccion: z.string().optional(),
  areas: z.array(z.string()).min(1, 'Debe seleccionar al menos un área'),
  motivacion: z.string().optional(),
  experienciaPrevia: z.string().optional(),
  disponibilidad: z.string().optional(),
  emergenciaContacto: z.string().optional(),
  emergenciaTelefono: z.string().optional(),
  observaciones: z.string().optional(),
  fotoUrl: z.string().url().optional()
})

export const ActualizarVoluntarioSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  telefono: z.string().optional(),
  fechaNacimiento: z.string().optional(),
  ciudad: z.string().optional(),
  provincia: z.string().optional(),
  pais: z.string().optional(),
  direccion: z.string().optional(),
  areas: z.array(z.string()).optional(),
  motivacion: z.string().optional(),
  experienciaPrevia: z.string().optional(),
  disponibilidad: z.string().optional(),
  emergenciaContacto: z.string().optional(),
  emergenciaTelefono: z.string().optional(),
  observaciones: z.string().optional(),
  fotoUrl: z.string().url().optional(),
  visible: z.boolean().optional(),
  estado: z.enum(['ACTIVO', 'INACTIVO', 'SUSPENDIDO', 'RETIRADO']).optional()
})

export const CrearActividadSchema = z.object({
  voluntarioId: z.string(),
  titulo: z.string(),
  tipo: z.string(),
  descripcion: z.string().optional(),
  fecha: z.string(),
  duracion: z.number().optional(),
  observaciones: z.string().optional()
})

export const CrearHorarioSchema = z.object({
  voluntarioId: z.string(),
  diaSemana: z.string(),
  horaInicio: z.string(),
  horaFin: z.string(),
  observaciones: z.string().optional()
})

export type CrearVoluntarioData = z.infer<typeof CrearVoluntarioSchema>
export type ActualizarVoluntarioData = z.infer<typeof ActualizarVoluntarioSchema>
export type CrearActividadData = z.infer<typeof CrearActividadSchema>
export type CrearHorarioData = z.infer<typeof CrearHorarioSchema>

// Generar slug único
function generarSlug(nombre: string, apellido: string): string {
  const base = `${nombre}-${apellido}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  const timestamp = Date.now().toString().slice(-6)
  return `${base}-${timestamp}`
}

// Generar código QR
async function generarQR(slug: string): Promise<string> {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/voluntarios/${slug}`
    return await QRCode.toString(url, { type: 'svg' })
  } catch (error) {
    console.error('Error generando QR:', error)
    throw new Error('Error al generar código QR')
  }
}

// CRUD de Voluntarios
export async function crearVoluntario(data: CrearVoluntarioData) {
  try {
    const validatedData = CrearVoluntarioSchema.parse(data)

    // Verificar que el email no exista
    const emailExiste = await prisma.voluntario.findUnique({
      where: { email: validatedData.email }
    })

    if (emailExiste) {
      throw new Error('Ya existe un voluntario con este email')
    }

    const slug = generarSlug(validatedData.nombre, validatedData.apellido)
    const qrCode = await generarQR(slug)

    const voluntario = await prisma.voluntario.create({
      data: {
        ...validatedData,
        areas: validatedData.areas as any, // Casting temporal para enum
        slug,
        qrCode,
        fechaIngreso: new Date(),
        estado: 'ACTIVO',
        visible: true
      },
      include: {
        _count: {
          select: {
            actividades: true
          }
        }
      }
    })

    return voluntario
  } catch (error) {
    console.error('Error creating voluntario:', error)
    if (error instanceof z.ZodError) {
      throw new Error(`Datos inválidos: ${error.errors.map(e => e.message).join(', ')}`)
    }
    throw error
  }
}

export async function obtenerVoluntario(id: string) {
  try {
    const voluntario = await prisma.voluntario.findUnique({
      where: { id },
      include: {
        actividades: {
          orderBy: { fecha: 'desc' },
          take: 10
        },
        horarios: {
          orderBy: { diaSemana: 'asc' }
        },
        _count: {
          select: {
            actividades: true
          }
        }
      }
    })

    return voluntario
  } catch (error) {
    console.error('Error getting voluntario:', error)
    throw new Error('Error al obtener el voluntario')
  }
}

export async function obtenerVoluntarioPorSlug(slug: string) {
  try {
    const voluntario = await prisma.voluntario.findUnique({
      where: { slug },
      include: {
        actividades: {
          orderBy: { fecha: 'desc' },
          take: 10,
          select: {
            id: true,
            tipo: true,
            descripcion: true,
            fecha: true,
            estado: true,
            observaciones: true
          }
        },
        _count: {
          select: {
            actividades: true
          }
        }
      }
    })

    return voluntario
  } catch (error) {
    console.error('Error obteniendo voluntario por slug:', error)
    throw new Error('Error al obtener el voluntario por slug')
  }
}

interface FiltrosVoluntarios {
  busqueda?: string
  area?: string
  ciudad?: string
  estado?: string
  visible?: boolean
}

export async function listarVoluntarios(
  filtros: FiltrosVoluntarios = {},
  page: number = 1,
  limit: number = 10
) {
  try {
    const offset = (page - 1) * limit
    const where: any = {}

    // Aplicar filtros
    if (filtros.busqueda) {
      where.OR = [
        { nombre: { contains: filtros.busqueda, mode: 'insensitive' } },
        { apellido: { contains: filtros.busqueda, mode: 'insensitive' } },
        { email: { contains: filtros.busqueda, mode: 'insensitive' } },
        { ciudad: { contains: filtros.busqueda, mode: 'insensitive' } }
      ]
    }

    if (filtros.area) {
      where.areas = { has: filtros.area }
    }

    if (filtros.ciudad) {
      where.ciudad = { contains: filtros.ciudad, mode: 'insensitive' }
    }

    if (filtros.estado) {
      where.estado = filtros.estado
    }

    if (filtros.visible !== undefined) {
      where.visible = filtros.visible
    }

    const [voluntarios, total] = await Promise.all([
      prisma.voluntario.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { fechaIngreso: 'desc' },
        include: {
          _count: {
            select: {
              actividades: true
            }
          }
        }
      }),
      prisma.voluntario.count({ where })
    ])

    return {
      voluntarios,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('Error listing voluntarios:', error)
    throw new Error('Error al listar los voluntarios')
  }
}

export async function actualizarVoluntario(id: string, data: any) {
  try {
    // Separar los datos que necesitan tratamiento especial
    const { areas, fechaNacimiento, ...otherData } = data

    // Preparar los datos para la actualización
    const updateData: any = {
      ...otherData,
      ...(fechaNacimiento && {
        fechaNacimiento: new Date(fechaNacimiento)
      }),
      ...(areas && {
        areas: {
          set: areas as any[] // Usar set para reemplazar completamente el array
        }
      })
    }

    const voluntario = await prisma.voluntario.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            actividades: true,
            horarios: true
          }
        }
      }
    })

    return voluntario
  } catch (error) {
    console.error('Error updating voluntario:', error)
    throw new Error('Error al actualizar el voluntario')
  }
}

export async function eliminarVoluntario(id: string) {
  try {
    // Eliminar actividades relacionadas primero
    await prisma.actividadVoluntario.deleteMany({
      where: { voluntarioId: id }
    })

    // Eliminar horarios relacionados
    await prisma.horarioVoluntario.deleteMany({
      where: { voluntarioId: id }
    })

    // Eliminar voluntario
    await prisma.voluntario.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting voluntario:', error)
    throw new Error('Error al eliminar el voluntario')
  }
}

// Estadísticas
export async function obtenerEstadisticasVoluntarios() {
  try {
    const [
      totalVoluntarios,
      voluntariosActivos,
      voluntariosInactivos,
      actividadesMes
    ] = await Promise.all([
      prisma.voluntario.count(),
      prisma.voluntario.count({
        where: { estado: 'ACTIVO' }
      }),
      prisma.voluntario.count({
        where: { estado: 'INACTIVO' }
      }),
      prisma.actividadVoluntario.count({
        where: {
          fecha: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ])

    return {
      totalVoluntarios,
      voluntariosActivos,
      voluntariosInactivos,
      actividadesMes
    }
  } catch (error) {
    console.error('Error getting voluntarios stats:', error)
    throw new Error('Error al obtener estadísticas de voluntarios')
  }
}

// Gestión de Actividades
export async function crearActividad(data: CrearActividadData) {
  try {
    const validatedData = CrearActividadSchema.parse(data)

    const actividad = await prisma.actividadVoluntario.create({
      data: {
        ...validatedData,
        fecha: new Date(validatedData.fecha),
        estado: 'PROGRAMADA' as any,
        tipo: validatedData.tipo as any
      }
    })

    return actividad
  } catch (error) {
    console.error('Error creating actividad:', error)
    if (error instanceof z.ZodError) {
      throw new Error(`Datos inválidos: ${error.errors.map((e: any) => e.message).join(', ')}`)
    }
    throw error
  }
}

export async function actualizarEstadoActividad(
  actividadId: string,
  estado: string,
  observaciones?: string
) {
  try {
    const actividad = await prisma.actividadVoluntario.update({
      where: { id: actividadId },
      data: {
        estado: estado as any,
        observaciones
      }
    })

    return actividad
  } catch (error) {
    console.error('Error updating actividad estado:', error)
    throw new Error('Error al actualizar el estado de la actividad')
  }
}

// Gestión de Horarios
export async function crearHorario(data: CrearHorarioData) {
  try {
    const validatedData = CrearHorarioSchema.parse(data)

    const horario = await prisma.horarioVoluntario.create({
      data: {
        ...validatedData,
        diaSemana: validatedData.diaSemana as any
      }
    })

    return horario
  } catch (error) {
    console.error('Error creating horario:', error)
    if (error instanceof z.ZodError) {
      throw new Error(`Datos inválidos: ${error.errors.map((e: any) => e.message).join(', ')}`)
    }
    throw error
  }
}

export async function eliminarHorario(horarioId: string) {
  try {
    await prisma.horarioVoluntario.delete({
      where: { id: horarioId }
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting horario:', error)
    throw new Error('Error al eliminar el horario')
  }
}
