import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const createPublicationSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido').max(200),
  slug: z.string().min(1, 'El slug es requerido').regex(/^[a-z0-9-]+$/, 'El slug debe contener solo letras minúsculas, números y guiones'),
  resumen: z.string().optional(),
  contenido: z.string().min(1, 'El contenido es requerido'),
  destacada: z.boolean().default(false),
  publicada: z.boolean().default(false),
  fechaPublicacion: z.string().datetime().optional(),
  metaTitulo: z.string().max(60).optional(),
  metaDescripcion: z.string().max(160).optional(),
  palabrasClave: z.string().optional(),
  imagenDestacada: z.string().url().optional(),
  altImagen: z.string().optional(),
  categoriaId: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const published = searchParams.get('published')
    const categoryId = searchParams.get('categoryId')

    const where: any = {}

    if (published !== null) {
      where.publicada = published === 'true'
    }

    if (categoryId) {
      where.categoriaId = categoryId
    }

    const [publications, total] = await Promise.all([
      prisma.publicacion.findMany({
        where,
        include: {
          autor: {
            select: { id: true, name: true, email: true }
          },
          categoria: {
            select: { id: true, nombre: true, slug: true, color: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.publicacion.count({ where })
    ])

    return NextResponse.json({
      publications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching publications:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Check if user has admin role
    const user = await prisma.user.findFirst({
      where: { id: session.user.id },
      include: { roles: { include: { role: true } } }
    })

    const isAdmin = user?.roles.some(userRole => userRole.role.name === 'ADMIN')
    if (!isAdmin) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = createPublicationSchema.parse(body)

    // Check if slug is unique
    const existingPublication = await prisma.publicacion.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingPublication) {
      return NextResponse.json(
        { error: 'El slug ya existe' },
        { status: 400 }
      )
    }

    const publication = await prisma.publicacion.create({
      data: {
        ...validatedData,
        fechaPublicacion: validatedData.publicada ? new Date() : null,
        autorId: session.user.id,
      },
      include: {
        autor: {
          select: { id: true, name: true, email: true }
        },
        categoria: {
          select: { id: true, nombre: true, slug: true, color: true }
        }
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE_PUBLICATION',
        entity: 'Publicacion',
        entityId: publication.id,
        details: JSON.stringify({
          titulo: publication.titulo,
          publicada: publication.publicada
        })
      }
    })

    return NextResponse.json(publication, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating publication:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
