#!/bin/bash

# Script de backup automático para PostgreSQL en Docker
# Se ejecuta como servicio en docker-compose.prod.yml

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="${POSTGRES_DB}"
DB_USER="${POSTGRES_USER}"
DB_HOST="db"

# Crear directorio de backups si no existe
mkdir -p $BACKUP_DIR

# Función para logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Ejecutar backup
log "Iniciando backup de $DB_NAME"

# Backup completo de la base de datos
PGPASSWORD=$POSTGRES_PASSWORD pg_dump \
    -h $DB_HOST \
    -U $DB_USER \
    -d $DB_NAME \
    --clean \
    --if-exists \
    --create \
    --format=custom \
    --compress=9 \
    > "$BACKUP_DIR/pazanimal_backup_$DATE.dump"

if [ $? -eq 0 ]; then
    log "Backup completado exitosamente: pazanimal_backup_$DATE.dump"

    # Comprimir backup adicional (opcional)
    gzip "$BACKUP_DIR/pazanimal_backup_$DATE.dump"
    log "Backup comprimido: pazanimal_backup_$DATE.dump.gz"

    # Eliminar backups antiguos (mantener últimos 7 días)
    find $BACKUP_DIR -name "pazanimal_backup_*.dump.gz" -mtime +7 -delete
    log "Backups antiguos eliminados"

else
    log "ERROR: Falló el backup de la base de datos"
    exit 1
fi

# Script para programar backups diarios (agregar a crontab)
# 0 2 * * * /path/to/backup.sh >> /var/log/backup.log 2>&1
