#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de datos...\n');

  try {
    // Limpiar datos existentes
    console.log('🗑️  Limpiando datos existentes...');
    await prisma.actividadVoluntario.deleteMany();
    await prisma.horarioVoluntario.deleteMany();
    await prisma.voluntario.deleteMany();
    await prisma.inscripcionEvento.deleteMany();
    await prisma.evento.deleteMany();
    await prisma.donacion.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.userRole.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();

    // 1. Crear roles
    console.log('👥 Creando roles...');
    const adminRole = await prisma.role.create({
      data: {
        name: 'ADMIN',
        description: 'Administrador con acceso completo'
      }
    });

    const userRole = await prisma.role.create({
      data: {
        name: 'USUARIO',
        description: 'Usuario registrado básico'
      }
    });

    const veterinariaRole = await prisma.role.create({
      data: {
        name: 'VETERINARIA',
        description: 'Veterinaria colaboradora'
      }
    });

    const voluntarioRole = await prisma.role.create({
      data: {
        name: 'VOLUNTARIO',
        description: 'Voluntario de la fundación'
      }
    });

    // 2. Crear usuarios
    console.log('👤 Creando usuarios...');
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@pazanimal.org',
        name: 'Administrador Principal',
        password: await bcrypt.hash('admin123456', 12),
        emailVerified: new Date(),
      }
    });

    const testUser = await prisma.user.create({
      data: {
        email: 'usuario@test.com',
        name: 'Usuario de Prueba',
        password: await bcrypt.hash('usuario123', 12),
        emailVerified: new Date(),
      }
    });

    const vetUser = await prisma.user.create({
      data: {
        email: 'vet@clinicaveterinaria.com',
        name: 'Dr. María Veterinaria',
        password: await bcrypt.hash('vet123456', 12),
        emailVerified: new Date(),
      }
    });

    // 3. Asignar roles
    console.log('🔑 Asignando roles...');
    await prisma.userRole.createMany({
      data: [
        { userId: adminUser.id, roleId: adminRole.id },
        { userId: testUser.id, roleId: userRole.id },
        { userId: vetUser.id, roleId: veterinariaRole.id }
      ]
    });

    // 4. Crear eventos
    console.log('📅 Creando eventos...');
    const evento1 = await prisma.evento.create({
      data: {
        titulo: 'Jornada de Adopción Responsable',
        descripcion: 'Gran evento de adopción con más de 50 mascotas esperando un hogar.',
        fechaInicio: new Date('2025-09-15'),
        ubicacion: 'Plaza Central de Corrientes',
        cupoMaximo: 200,
        precio: 0,
        slug: 'jornada-adopcion-septiembre-2025',
        organizadorId: adminUser.id,
      }
    });

    const evento2 = await prisma.evento.create({
      data: {
        titulo: 'Taller de Primeros Auxilios para Mascotas',
        descripcion: 'Aprende técnicas básicas de primeros auxilios.',
        fechaInicio: new Date('2025-09-22'),
        ubicacion: 'Centro de Convenciones Corrientes',
        cupoMaximo: 50,
        precio: 2500.00,
        slug: 'taller-primeros-auxilios-mascotas',
        organizadorId: adminUser.id,
      }
    });

    // 5. Crear donaciones
    console.log('💰 Creando donaciones...');
    await prisma.donacion.createMany({
      data: [
        {
          monto: 5000.00,
          moneda: 'ARS',
          estado: 'APROBADA',
          donante: 'Juan Pérez',
          email: 'juan.perez@email.com',
          esAnonima: false,
          externalReference: 'DON-001-2025',
          paymentId: 'MP-12345678',
          fechaPago: new Date('2025-08-01'),
          userId: testUser.id
        },
        {
          monto: 2500.00,
          moneda: 'ARS',
          estado: 'APROBADA',
          donante: 'María González',
          email: 'maria.gonzalez@email.com',
          esAnonima: false,
          externalReference: 'DON-002-2025',
          paymentId: 'MP-87654321',
          fechaPago: new Date('2025-08-05')
        }
      ]
    });

    // 6. Crear voluntarios
    console.log('🤝 Creando voluntarios...');
    const voluntarios = [
      {
        nombre: 'Ana',
        apellido: 'Rodríguez',
        email: 'ana.rodriguez@email.com',
        telefono: '+54 379 4567890',
        whatsapp: '+54 379 4567890',
        fechaNacimiento: new Date('1995-03-15'),
        direccion: 'Av. 3 de Abril 1234',
        ciudad: 'Corrientes',
        provincia: 'Corrientes',
        pais: 'Argentina',
        dni: '35123456',
        estado: 'ACTIVO',
        motivacion: 'Siempre amé a los animales y quiero ayudar a mejorar sus vidas.',
        areas: ['CUIDADO_ANIMALES', 'COMUNICACION'],
        qrCode: 'VOL-ANA-001-' + Date.now(),
        slug: 'ana-rodriguez-voluntaria',
        visible: true,
        createdBy: adminUser.id
      },
      {
        nombre: 'Carlos',
        apellido: 'Mendoza',
        email: 'carlos.mendoza@email.com',
        telefono: '+54 379 5678901',
        fechaNacimiento: new Date('1988-07-22'),
        direccion: 'Calle San Juan 567',
        ciudad: 'Corrientes',
        provincia: 'Corrientes',
        pais: 'Argentina',
        dni: '28234567',
        estado: 'ACTIVO',
        motivacion: 'Quiero contribuir al bienestar animal y educar sobre tenencia responsable.',
        areas: ['VETERINARIA', 'EDUCACION'],
        qrCode: 'VOL-CAR-002-' + (Date.now() + 1),
        slug: 'carlos-mendoza-veterinario-voluntario',
        visible: true,
        createdBy: adminUser.id
      }
    ];

    for (const vol of voluntarios) {
      await prisma.voluntario.create({ data: vol });
    }

    // Estadísticas finales
    const stats = {
      usuarios: await prisma.user.count(),
      roles: await prisma.role.count(),
      voluntarios: await prisma.voluntario.count(),
      eventos: await prisma.evento.count(),
      donaciones: await prisma.donacion.count()
    };

    console.log('\n🎉 ¡Seed completado exitosamente!');
    console.log('📊 Datos creados:');
    console.log(`   • ${stats.usuarios} usuarios`);
    console.log(`   • ${stats.roles} roles`);
    console.log(`   • ${stats.voluntarios} voluntarios`);
    console.log(`   • ${stats.eventos} eventos`);
    console.log(`   • ${stats.donaciones} donaciones`);

    console.log('\n👤 Credenciales de acceso:');
    console.log('   📧 admin@pazanimal.org (contraseña: admin123456)');
    console.log('   📧 usuario@test.com (contraseña: usuario123)');
    console.log('   📧 vet@clinicaveterinaria.com (contraseña: vet123456)\n');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('✅ Desconectado de la base de datos');
  })
  .catch(async (e) => {
    console.error('💥 Error fatal:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
