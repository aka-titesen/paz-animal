import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  roles: z.array(z.string()).optional(),
});

// GET - Obtener todos los usuarios
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user.roles.includes('ADMIN')) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    const usersWithRoles = users.map(user => ({
      ...user,
      roles: user.roles.map((ur: any) => ur.role.name),
      password: undefined, // No devolver la contraseña
    }));

    return NextResponse.json({
      users: usersWithRoles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo usuario (admin)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user.roles.includes('ADMIN')) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    // Verificar si el email ya existe
    if (validatedData.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (existingUser) {
        return NextResponse.json(
          { message: 'El email ya está en uso' },
          { status: 400 }
        );
      }
    }

    const user = await prisma.user.create({
      data: {
        name: validatedData.name || '',
        email: validatedData.email || '',
        emailVerified: new Date(),
      },
    });

    // Asignar roles si se especifican
    if (validatedData.roles && validatedData.roles.length > 0) {
      await prisma.userRole.createMany({
        data: validatedData.roles.map(roleId => ({
          userId: user.id,
          roleId,
        })),
      });
    }

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        action: 'CREATE_USER',
        entity: 'User',
        entityId: user.id,
        userId: session.user.id,
        details: {
          name: user.name,
          email: user.email,
          roles: validatedData.roles,
          createdBy: session.user.email,
          timestamp: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error al crear usuario:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Datos inválidos', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
