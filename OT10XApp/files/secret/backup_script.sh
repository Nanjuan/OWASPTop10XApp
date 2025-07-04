#!/bin/bash
# Database Backup Script
# WARNING: This script contains sensitive database credentials!

# Database connection details
DB_HOST="production-db.company.com"
DB_PORT="5432"
DB_NAME="production_database"
DB_USER="backup_user"
DB_PASSWORD="BackupPass456!"

# Backup configuration
BACKUP_DIR="/var/backups/database"
BACKUP_RETENTION=30
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${DB_NAME}_${DATE}.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Perform database backup
echo "Starting database backup..."
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME > $BACKUP_DIR/$BACKUP_FILE

# Compress backup file
gzip $BACKUP_DIR/$BACKUP_FILE

# Upload to S3 (if configured)
if [ -n "$AWS_ACCESS_KEY_ID" ]; then
    aws s3 cp $BACKUP_DIR/${BACKUP_FILE}.gz s3://company-backups/database/
fi

# Clean up old backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +$BACKUP_RETENTION -delete

echo "Backup completed: $BACKUP_FILE.gz"

# Send notification email
echo "Database backup completed successfully" | mail -s "Backup Status" admin@company.com 