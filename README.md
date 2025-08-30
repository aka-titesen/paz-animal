# 🐾 Plataforma Paz Animal

Plataforma web oficial de la Fundación Paz Animal, una ONG argentina dedicada a la protección y rescate de animales.

## 🚀 Tecnologías

- **Frontend:** Next.js 14+ (App Router) + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes + Prisma ORM
- **Base de datos:** PostgreSQL
- **Autenticación:** NextAuth.js v5
- **Pagos:** MercadoPago (próximamente)
- **Contenedores:** Docker + Docker Compose
- **Testing:** Jest + Playwright
- **Deploy:** Vercel

## 🐳 Desarrollo con Docker (Recomendado)

### Prerrequisitos

- Docker
- Docker Compose
- Git

### Instalación rápida

```bash
# Clonar el repositorio
git clone https://github.com/aka-titesen/paz-animal.git
cd paz-animal

# Copiar variables de entorno
cp .env.example .env.local

# Levantar servicios con Docker
pnpm docker:dev
```

La aplicación estará disponible en: http://localhost:3000

### Comandos Docker útiles

```bash
# Desarrollo con hot-reload
pnpm docker:dev

# Build para producción
pnpm docker:build

# Ver logs de la aplicación
docker-compose logs -f app

# Ejecutar migraciones de BD
docker-compose exec app pnpm db:migrate

# Ejecutar seed de BD
docker-compose exec app pnpm db:seed

# Acceder a la shell del contenedor
docker-compose exec app sh

# Parar todos los servicios
docker-compose down

# Parar y eliminar volúmenes (CUIDADO: elimina la BD)
docker-compose down -v
```

## 💻 Desarrollo Local (Sin Docker)

### Prerrequisitos

- Node.js 18+
- pnpm
- PostgreSQL 15+
- Redis (opcional)

### Instalación

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Ejecutar migraciones
pnpm db:migrate

# Ejecutar seed
pnpm db:seed

# Iniciar desarrollo
pnpm dev
```

## 🗄️ Base de Datos

### Migraciones

```bash
# Crear nueva migración
pnpm prisma migrate dev --name nombre_migracion

# Aplicar migraciones
pnpm db:migrate

# Reset completo (CUIDADO: elimina todos los datos)
pnpm db:reset

# Ver BD con Prisma Studio
pnpm db:studio
```

### Usuarios por defecto

Después de ejecutar el seed:

- **Admin:** admin@pazanimal.org / admin123
- **Usuario test:** usuario@test.com / test123

## 🧪 Testing

```bash
# Tests unitarios
pnpm test

# Tests en modo watch
pnpm test:watch

# Tests con coverage
pnpm test:coverage

# Tests E2E
pnpm test:e2e
```

## 🔧 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Desarrollo local |
| `pnpm build` | Build para producción |
| `pnpm start` | Iniciar app en producción |
| `pnpm lint` | Ejecutar ESLint |
| `pnpm lint:fix` | Corregir errores de ESLint |
| `pnpm type-check` | Verificar tipos TypeScript |
| `pnpm docker:dev` | Desarrollo con Docker |
| `pnpm docker:build` | Build Docker para producción |

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rutas de autenticación
│   ├── admin/             # Panel administrativo
│   ├── api/               # API Routes
│   └── globals.css        # Estilos globales
├── components/            # Componentes reutilizables
│   ├── ui/                # Componentes base
│   └── forms/             # Formularios
├── lib/                   # Utilidades y configuraciones
│   ├── auth.ts            # NextAuth config
│   ├── prisma.ts          # Prisma client
│   └── validations.ts     # Esquemas Zod
├── services/              # Servicios de dominio
└── types/                 # Tipos TypeScript

prisma/
├── schema.prisma          # Esquema de BD
├── seed.ts               # Datos iniciales
└── migrations/           # Migraciones

docker/
├── Dockerfile            # Imagen para producción
├── Dockerfile.dev        # Imagen para desarrollo
├── docker-compose.yml    # Servicios desarrollo
└── docker-compose.prod.yml # Servicios producción
```

## 🔐 Autenticación y Roles

El sistema maneja 4 roles principales:

- **ADMIN:** Acceso completo al sistema
- **USUARIO:** Acceso básico, puede registrar mascotas y donar
- **VETERINARIA:** Acceso a panel veterinario y consultas
- **VOLUNTARIO:** Acceso a actividades y eventos

## 📊 Roadmap

Para el seguimiento detallado de sprints, ver [`PazAnimal-ERS_IEEE830/Sprints.md`](./PazAnimal-ERS_IEEE830/Sprints.md)

- [x] **Sprint 0:** ✅ Base técnica con Docker - COMPLETADO
- [x] **Sprint 1:** ✅ Autenticación y panel administrativo - COMPLETADO
- [ ] **Sprint 2:** Contenido público y SEO
- [ ] **Sprint 3:** Sistema de donaciones (MVP v1)
- [ ] **Sprint 4:** Mascotas con QR
- [ ] **Sprint 5:** Membresías y veterinarias

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

### Convenciones de commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `docs:` cambios en documentación
- `style:` cambios de formato (no afectan funcionalidad)
- `refactor:` refactorización de código
- `test:` agregar o modificar tests
- `chore:` cambios en build, dependencias, etc.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🐾 Sobre Paz Animal

Fundación Paz Animal es una ONG establecida en 2020 en Corrientes, Argentina, dedicada a la protección, rescate y cuidado de animales en situación de vulnerabilidad.

**Misión:** Promover el amor, cuidado y respeto hacia los animales a través de acciones concretas de rescate, cuidado veterinario y educación.

**Visión:** Ser referentes en protección animal en Argentina, creando una sociedad más consciente y responsable con los animales.

---

Made with ❤️ for animals by the Paz Animal team
