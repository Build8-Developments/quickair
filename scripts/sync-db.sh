#!/bin/bash

# Sync Strapi database from remote VPS to local
# Usage: ./sync-db.sh [pull|push]

REMOTE_HOST="dep-quickair"
REMOTE_DB_PATH="/var/www/quickair/apps/strapi/.tmp/data.db"
LOCAL_DB_PATH="./apps/strapi/.tmp/data.db"
BACKUP_DIR="./database-backups"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to create backup
create_backup() {
    local db_path=$1
    local backup_name=$2
    
    if [ -f "$db_path" ]; then
        mkdir -p "$BACKUP_DIR"
        local timestamp=$(date +%Y%m%d_%H%M%S)
        local backup_file="$BACKUP_DIR/${backup_name}_${timestamp}.db"
        cp "$db_path" "$backup_file"
        echo -e "${GREEN}✅ Backup created: $backup_file${NC}"
    fi
}

# Function to pull database from remote
pull_database() {
    echo -e "${YELLOW}📥 Pulling database from remote server...${NC}"
    
    # Create backup of local database
    create_backup "$LOCAL_DB_PATH" "local_before_pull"
    
    # Ensure local .tmp directory exists
    mkdir -p "./apps/strapi/.tmp"
    
    # Download from remote
    scp "${REMOTE_HOST}:${REMOTE_DB_PATH}" "$LOCAL_DB_PATH"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database pulled successfully!${NC}"
        echo -e "${GREEN}Local database updated: $LOCAL_DB_PATH${NC}"
    else
        echo -e "${RED}❌ Failed to pull database${NC}"
        exit 1
    fi
}

# Function to push database to remote
push_database() {
    echo -e "${YELLOW}📤 Pushing database to remote server...${NC}"
    
    # Check if local database exists
    if [ ! -f "$LOCAL_DB_PATH" ]; then
        echo -e "${RED}❌ Local database not found: $LOCAL_DB_PATH${NC}"
        exit 1
    fi
    
    # Create backup of remote database
    echo -e "${YELLOW}Creating backup of remote database...${NC}"
    ssh "$REMOTE_HOST" "mkdir -p /var/www/quickair-backups/manual-db-backups && \
                        cp ${REMOTE_DB_PATH} /var/www/quickair-backups/manual-db-backups/data_$(date +%Y%m%d_%H%M%S).db"
    
    # Create backup of local database
    create_backup "$LOCAL_DB_PATH" "local_before_push"
    
    # Upload to remote
    scp "$LOCAL_DB_PATH" "${REMOTE_HOST}:${REMOTE_DB_PATH}"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database pushed successfully!${NC}"
        echo -e "${YELLOW}⚠️  You may need to restart Strapi on the server:${NC}"
        echo -e "${YELLOW}   ssh $REMOTE_HOST 'cd /var/www/quickair && pm2 restart quickair-strapi'${NC}"
    else
        echo -e "${RED}❌ Failed to push database${NC}"
        exit 1
    fi
}

# Function to show database info
show_info() {
    echo -e "${YELLOW}📊 Database Information:${NC}"
    echo ""
    
    # Local database info
    if [ -f "$LOCAL_DB_PATH" ]; then
        local_size=$(du -h "$LOCAL_DB_PATH" | cut -f1)
        local_modified=$(stat -c %y "$LOCAL_DB_PATH" 2>/dev/null || stat -f "%Sm" "$LOCAL_DB_PATH")
        echo -e "${GREEN}Local Database:${NC}"
        echo "  Path: $LOCAL_DB_PATH"
        echo "  Size: $local_size"
        echo "  Modified: $local_modified"
    else
        echo -e "${RED}Local Database: Not found${NC}"
    fi
    
    echo ""
    
    # Remote database info
    echo -e "${GREEN}Remote Database:${NC}"
    ssh "$REMOTE_HOST" "if [ -f ${REMOTE_DB_PATH} ]; then \
                          echo '  Path: ${REMOTE_DB_PATH}'; \
                          echo \"  Size: \$(du -h ${REMOTE_DB_PATH} | cut -f1)\"; \
                          echo \"  Modified: \$(stat -c %y ${REMOTE_DB_PATH})\"; \
                        else \
                          echo '  Not found'; \
                        fi"
}

# Main script logic
case "$1" in
    pull)
        pull_database
        ;;
    push)
        echo -e "${RED}⚠️  WARNING: This will overwrite the production database!${NC}"
        read -p "Are you sure you want to push? (yes/no): " -r
        if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
            push_database
        else
            echo -e "${YELLOW}Push cancelled.${NC}"
            exit 0
        fi
        ;;
    info)
        show_info
        ;;
    *)
        echo "Strapi Database Sync Script"
        echo ""
        echo "Usage: $0 {pull|push|info}"
        echo ""
        echo "Commands:"
        echo "  pull  - Download database from remote server to local"
        echo "  push  - Upload local database to remote server (requires confirmation)"
        echo "  info  - Show information about local and remote databases"
        echo ""
        echo "Examples:"
        echo "  $0 pull          # Download production database"
        echo "  $0 push          # Upload local database to production"
        echo "  $0 info          # Show database info"
        echo ""
        echo "Note: Backups are automatically created in $BACKUP_DIR"
        exit 1
        ;;
esac
