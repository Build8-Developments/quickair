#!/bin/bash

# QuickAir Backup & Restore Script
# Usage: 
#   ./backup.sh backup    - Create a manual backup
#   ./backup.sh restore   - Restore from latest backup
#   ./backup.sh list      - List all backups
#   ./backup.sh restore <backup_name> - Restore from specific backup

DEPLOY_DIR="/var/www/quickair"
BACKUP_DIR="/var/www/quickair-backups"

case "$1" in
  backup)
    echo "💾 Creating manual backup..."
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_PATH="$BACKUP_DIR/manual_backup_$TIMESTAMP"
    mkdir -p "$BACKUP_PATH"
    
    # Stop applications
    echo "⏸️  Stopping applications..."
    pm2 stop all
    
    # Backup database
    if [ -f "$DEPLOY_DIR/apps/strapi/.tmp/data.db" ]; then
      echo "💾 Backing up database..."
      mkdir -p "$BACKUP_PATH/strapi-db"
      cp -r "$DEPLOY_DIR/apps/strapi/.tmp" "$BACKUP_PATH/strapi-db/"
    fi
    
    # Backup uploads
    if [ -d "$DEPLOY_DIR/apps/strapi/public/uploads" ]; then
      echo "💾 Backing up uploads..."
      mkdir -p "$BACKUP_PATH/strapi-uploads"
      cp -r "$DEPLOY_DIR/apps/strapi/public/uploads" "$BACKUP_PATH/strapi-uploads/"
    fi
    
    # Backup env files
    echo "💾 Backing up environment files..."
    cp "$DEPLOY_DIR/apps/strapi/.env" "$BACKUP_PATH/strapi.env" 2>/dev/null || true
    cp "$DEPLOY_DIR/apps/frontend/.env.local" "$BACKUP_PATH/frontend.env.local" 2>/dev/null || true
    
    # Create manifest
    cat > "$BACKUP_PATH/manifest.txt" << MANIFEST
Backup Type: Manual
Created: $(date)
Git commit: $(cd "$DEPLOY_DIR" && git rev-parse HEAD 2>/dev/null || echo "N/A")
Git branch: $(cd "$DEPLOY_DIR" && git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "N/A")
MANIFEST
    
    # Restart applications
    echo "▶️  Restarting applications..."
    pm2 start all
    
    echo "✅ Backup created at: $BACKUP_PATH"
    ;;
    
  restore)
    if [ -z "$2" ]; then
      # Get latest backup
      BACKUP_NAME=$(ls -t "$BACKUP_DIR" | head -1)
      echo "🔄 Restoring from latest backup: $BACKUP_NAME"
    else
      BACKUP_NAME="$2"
      echo "🔄 Restoring from backup: $BACKUP_NAME"
    fi
    
    BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"
    
    if [ ! -d "$BACKUP_PATH" ]; then
      echo "❌ Backup not found: $BACKUP_PATH"
      exit 1
    fi
    
    # Stop applications
    echo "⏸️  Stopping applications..."
    pm2 stop all
    
    # Restore database
    if [ -f "$BACKUP_PATH/strapi-db/.tmp/data.db" ]; then
      echo "♻️  Restoring database..."
      rm -rf "$DEPLOY_DIR/apps/strapi/.tmp"
      mkdir -p "$DEPLOY_DIR/apps/strapi/.tmp"
      cp -r "$BACKUP_PATH/strapi-db/.tmp/"* "$DEPLOY_DIR/apps/strapi/.tmp/"
    fi
    
    # Restore uploads
    if [ -d "$BACKUP_PATH/strapi-uploads/uploads" ]; then
      echo "♻️  Restoring uploads..."
      rm -rf "$DEPLOY_DIR/apps/strapi/public/uploads"
      mkdir -p "$DEPLOY_DIR/apps/strapi/public"
      cp -r "$BACKUP_PATH/strapi-uploads/uploads" "$DEPLOY_DIR/apps/strapi/public/"
    fi
    
    # Restore env files (optional)
    if [ -f "$BACKUP_PATH/strapi.env" ]; then
      echo "♻️  Restoring Strapi environment file..."
      cp "$BACKUP_PATH/strapi.env" "$DEPLOY_DIR/apps/strapi/.env"
    fi
    if [ -f "$BACKUP_PATH/frontend.env.local" ]; then
      echo "♻️  Restoring Frontend environment file..."
      cp "$BACKUP_PATH/frontend.env.local" "$DEPLOY_DIR/apps/frontend/.env.local"
    fi
    
    # Restart applications
    echo "▶️  Restarting applications..."
    pm2 restart all
    
    echo "✅ Restore completed from: $BACKUP_PATH"
    cat "$BACKUP_PATH/manifest.txt"
    ;;
    
  list)
    echo "📋 Available backups:"
    echo ""
    for backup in $(ls -t "$BACKUP_DIR"); do
      if [ -f "$BACKUP_DIR/$backup/manifest.txt" ]; then
        echo "📦 $backup"
        cat "$BACKUP_DIR/$backup/manifest.txt"
        echo "---"
      fi
    done
    ;;
    
  *)
    echo "QuickAir Backup & Restore Script"
    echo ""
    echo "Usage:"
    echo "  ./backup.sh backup                    - Create a manual backup"
    echo "  ./backup.sh restore                   - Restore from latest backup"
    echo "  ./backup.sh restore <backup_name>     - Restore from specific backup"
    echo "  ./backup.sh list                      - List all backups"
    echo ""
    echo "Examples:"
    echo "  ./backup.sh backup"
    echo "  ./backup.sh restore"
    echo "  ./backup.sh restore backup_20241114_120000"
    echo "  ./backup.sh list"
    ;;
esac
