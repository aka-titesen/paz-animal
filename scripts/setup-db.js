#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 Configuración completa de base de datos\n');

try {
  console.log('🗄️  Paso 1: Aplicando migraciones...');
  execSync('node scripts/migrate.js', {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  console.log('🌱 Paso 2: Poblando con datos de ejemplo...');
  execSync('node scripts/seed.js', {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  console.log('🎉 ¡Base de datos lista para usar!\n');

} catch (error) {
  console.error('❌ Error en la configuración:', error.message);
  process.exit(1);
}
