-- CreateEnum
CREATE TYPE "EstadoVoluntario" AS ENUM ('ACTIVO', 'INACTIVO', 'SUSPENDIDO', 'BAJA');

-- CreateEnum
CREATE TYPE "AreaVoluntariado" AS ENUM ('CUIDADO_ANIMALES', 'VETERINARIA', 'LIMPIEZA', 'MANTENIMIENTO', 'TRANSPORTE', 'ADMINISTRACION', 'COMUNICACION', 'EDUCACION', 'EVENTOS', 'RECAUDACION', 'FOTOGRAFIA', 'ADOPCIONES', 'SOCIALIZACION');

-- CreateEnum
CREATE TYPE "TipoActividad" AS ENUM ('CUIDADO', 'LIMPIEZA', 'ALIMENTACION', 'SOCIALIZACION', 'TRANSPORTE', 'VETERINARIA', 'EVENTO', 'CAPACITACION', 'ADMINISTRACION', 'MANTENIMIENTO', 'COMUNICACION', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoActividad" AS ENUM ('PROGRAMADA', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA', 'REPROGRAMADA');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO');

-- CreateEnum
CREATE TYPE "EstadoDonacion" AS ENUM ('PENDIENTE', 'PROCESANDO', 'APROBADA', 'RECHAZADA', 'CANCELADA', 'REEMBOLSADA');

-- CreateTable
CREATE TABLE "voluntarios" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "whatsapp" TEXT,
    "fechaNacimiento" TIMESTAMP(3),
    "direccion" TEXT,
    "ciudad" TEXT,
    "provincia" TEXT,
    "pais" TEXT,
    "codigoPostal" TEXT,
    "dni" TEXT,
    "cuil" TEXT,
    "fechaIngreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "EstadoVoluntario" NOT NULL DEFAULT 'ACTIVO',
    "motivacion" TEXT,
    "experiencia" TEXT,
    "disponibilidad" TEXT,
    "habilidades" TEXT,
    "areas" "AreaVoluntariado"[],
    "qrCode" TEXT,
    "observaciones" TEXT,
    "slug" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "metaTitulo" TEXT,
    "metaDescripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "voluntarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actividades_voluntario" (
    "id" TEXT NOT NULL,
    "voluntarioId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL,
    "duracion" INTEGER,
    "tipo" "TipoActividad" NOT NULL,
    "estado" "EstadoActividad" NOT NULL DEFAULT 'PROGRAMADA',
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "actividades_voluntario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "horarios_voluntario" (
    "id" TEXT NOT NULL,
    "voluntarioId" TEXT NOT NULL,
    "diaSemana" "DiaSemana" NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "horarios_voluntario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donaciones" (
    "id" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'ARS',
    "estado" "EstadoDonacion" NOT NULL DEFAULT 'PENDIENTE',
    "donante" TEXT,
    "email" TEXT,
    "telefono" TEXT,
    "esAnonima" BOOLEAN NOT NULL DEFAULT false,
    "mensaje" TEXT,
    "externalReference" TEXT,
    "paymentId" TEXT,
    "fechaPago" TIMESTAMP(3),
    "metodoPago" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donaciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "voluntarios_email_key" ON "voluntarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "voluntarios_dni_key" ON "voluntarios"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "voluntarios_cuil_key" ON "voluntarios"("cuil");

-- CreateIndex
CREATE UNIQUE INDEX "voluntarios_qrCode_key" ON "voluntarios"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "voluntarios_slug_key" ON "voluntarios"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "donaciones_externalReference_key" ON "donaciones"("externalReference");

-- CreateIndex
CREATE UNIQUE INDEX "donaciones_paymentId_key" ON "donaciones"("paymentId");

-- AddForeignKey
ALTER TABLE "voluntarios" ADD CONSTRAINT "voluntarios_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voluntarios" ADD CONSTRAINT "voluntarios_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actividades_voluntario" ADD CONSTRAINT "actividades_voluntario_voluntarioId_fkey" FOREIGN KEY ("voluntarioId") REFERENCES "voluntarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actividades_voluntario" ADD CONSTRAINT "actividades_voluntario_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actividades_voluntario" ADD CONSTRAINT "actividades_voluntario_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horarios_voluntario" ADD CONSTRAINT "horarios_voluntario_voluntarioId_fkey" FOREIGN KEY ("voluntarioId") REFERENCES "voluntarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donaciones" ADD CONSTRAINT "donaciones_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
