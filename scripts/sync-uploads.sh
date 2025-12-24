#!/bin/bash

# Strapi Uploads Sync Script (Interactive Password Authentication)
# Syncs uploads from local development to production VPS
# This version works without sshpass by using interactive SSH

set -e  # Exit on any error

# Configuration
LOCAL_UPLOADS_PATH="./apps/strapi/public/uploads/"
REMOTE_USER="root"
REMOTE_HOST="104.248.240.38"  # Replace with your VPS IP or domain
REMOTE_PATH="/var/www/quickair/apps/strapi/public/uploads/"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if local uploads directory exists
if [ ! -d "$LOCAL_UPLOADS_PATH" ]; then
    print_error "Local uploads directory not found: $LOCAL_UPLOADS_PATH"
    print_error "Make sure you're running this script from the project root directory"
    exit 1
fi

# Display sync information
print_status "Strapi Uploads Sync (Interactive)"
print_status "================================="
print_status "Local path:  $LOCAL_UPLOADS_PATH"
print_status "Remote host: $REMOTE_USER@$REMOTE_HOST"
print_status "Remote path: $REMOTE_PATH"
echo

print_warning "You will be prompted for your password multiple times during this process"
print_warning "This is normal for interactive SSH authentication"
echo

# Confirm before proceeding
read -p "Do you want to proceed with the sync? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_status "Sync cancelled"
    exit 0
fi

# Test SSH connection
print_status "Testing SSH connection..."
print_status "Please enter your password when prompted:"
if ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" "echo 'SSH connection successful'"; then
    print_status "SSH connection test passed"
else
    print_error "SSH connection failed. Please check:"
    print_error "1. VPS IP/domain is correct"
    print_error "2. Username and password are correct"
    print_error "3. VPS is accessible"
    exit 1
fi

# Create remote directory if it doesn't exist
print_status "Ensuring remote directory exists..."
print_status "Please enter your password when prompted:"
ssh -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" "mkdir -p $REMOTE_PATH"

# Count local files
LOCAL_FILE_COUNT=$(find "$LOCAL_UPLOADS_PATH" -type f | wc -l)
print_status "Found $LOCAL_FILE_COUNT files to sync"

# Perform the sync using rsync
print_status "Starting file sync..."
print_status "Please enter your password when prompted:"
if rsync -avz --progress \
    -e "ssh -o StrictHostKeyChecking=no" \
    "$LOCAL_UPLOADS_PATH" \
    "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"; then
    
    print_status "Sync completed successfully!"
    
    # Verify sync by counting remote files
    print_status "Verifying sync..."
    print_status "Please enter your password when prompted:"
    REMOTE_FILE_COUNT=$(ssh -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" "find $REMOTE_PATH -type f | wc -l")
    print_status "Remote files: $REMOTE_FILE_COUNT"
    
    if [ "$LOCAL_FILE_COUNT" -eq "$REMOTE_FILE_COUNT" ]; then
        print_status "✅ File count matches - sync verified!"
    else
        print_warning "⚠️  File count mismatch - please check manually"
    fi
    
    # Set proper permissions on remote files
    print_status "Setting proper permissions on remote files..."
    print_status "Please enter your password when prompted:"
    ssh -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" "chown -R www-data:www-data $REMOTE_PATH && chmod -R 755 $REMOTE_PATH"
    
else
    print_error "Sync failed!"
    exit 1
fi

print_status "Upload sync completed!"