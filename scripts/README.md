# Scripts de Base de Datos - Paz Animal

Este directorio contiene scripts específicos para la gestión de la base de datos del proyecto.

## 📁 Archivos

### `migrate.js`
Script para aplicar migraciones de la base de datos.
- Resetea la base de datos completamente
- Aplica todas las migraciones de Prisma
- Genera el cliente Prisma actualizado

### `seed.js`
Script para poblar la base de datos con datos de ejemplo.
- Limpia todos los datos existentes
- Crea roles, usuarios, voluntarios, eventos y donaciones de prueba
- Incluye credenciales de acceso para testing

### `setup-db.js`
Script completo que ejecuta migración + seed.
- Combina `migrate.js` y `seed.js`
- Configuración completa desde cero

## 🚀 Comandos Disponibles

```bash
# Aplicar migraciones solamente
npm run db:migrate

# Poblar con datos de ejemplo solamente
npm run db:seed

# Configuración completa (migraciones + datos)
npm run db:setup

# Abrir Prisma Studio para ver datos
npm run db:studio
```

## 👤 Usuarios de Prueba

Después de ejecutar el seed, tendrás estos usuarios disponibles:

- **Administrador:** admin@pazanimal.org (contraseña: admin123456)
- **Usuario:** usuario@test.com (contraseña: usuario123)
- **Veterinaria:** vet@clinicaveterinaria.com (contraseña: vet123456)

## 📊 Datos de Ejemplo Incluidos

- ✅ 4 roles del sistema
- ✅ 3 usuarios con diferentes permisos
- ✅ 2 voluntarios activos
- ✅ 2 eventos programados
- ✅ 2 donaciones de ejemplo

## ⚠️ Importante

Estos scripts están diseñados para **desarrollo y testing**. En producción:
- No uses `db:setup` (destruye datos existentes)
- Usa solo `db:migrate` para aplicar nuevas migraciones
- Nunca ejecutes `seed.js` en producción con datos reales
