#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🗄️  Iniciando migración de base de datos...\n');

try {
  console.log('1. Reseteando base de datos...');
  execSync('npx prisma migrate reset --force', {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  console.log('\n✅ Migración completada exitosamente!');
  console.log('📊 Base de datos lista para usar\n');

} catch (error) {
  console.error('❌ Error durante la migración:', error.message);
  process.exit(1);
}
