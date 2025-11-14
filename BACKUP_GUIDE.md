# Backup & Restore Guide

## Automatic Backups (During Deployment)

Every time you deploy via GitHub Actions, the workflow automatically:

- ✅ Backs up the current Strapi database
- ✅ Backs up all uploaded files
- ✅ Backs up environment files
- ✅ Creates a manifest with git commit info
- ✅ Keeps the last 5 backups (auto-cleanup)
- ✅ Restores database/uploads if missing (fresh deployment)

**Backup location:** `/var/www/quickair-backups/backup_YYYYMMDD_HHMMSS/`

---

## Manual Backups (On VPS)

### Setup the backup script:

```bash
# On VPS as deploy user
cd /var/www/quickair
chmod +x scripts/backup.sh
```

### Create a manual backup:

```bash
./scripts/backup.sh backup
```

### List all backups:

```bash
./scripts/backup.sh list
```

### Restore from latest backup:

```bash
./scripts/backup.sh restore
```

### Restore from specific backup:

```bash
./scripts/backup.sh restore backup_20241114_120000
```

---

## What Gets Backed Up

1. **Strapi Database** (`apps/strapi/.tmp/data.db`)
2. **Uploaded Files** (`apps/strapi/public/uploads/`)
3. **Environment Files** (`.env` and `.env.local`)
4. **Git Information** (commit hash, branch)

---

## Backup Structure

```
/var/www/quickair-backups/
├── backup_20241114_120000/
│   ├── strapi-db/
│   │   └── .tmp/
│   │       └── data.db
│   ├── strapi-uploads/
│   │   └── uploads/
│   │       └── [media files]
│   ├── strapi.env
│   ├── frontend.env.local
│   └── manifest.txt
├── backup_20241114_130000/
└── backup_20241114_140000/
```

---

## Automated Scheduled Backups (Optional)

Set up a daily cron job:

```bash
# Edit crontab as deploy user
crontab -e

# Add this line for daily backup at 2 AM
0 2 * * * cd /var/www/quickair && ./scripts/backup.sh backup >> /var/log/quickair-backup.log 2>&1
```

---

## Restore Process

When you run restore:

1. Applications stop (PM2)
2. Database is restored
3. Uploads are restored
4. Environment files are restored (optional)
5. Applications restart

---

## Emergency Recovery

If deployment fails, you can quickly rollback:

```bash
# SSH to VPS
ssh deploy@165.227.130.158

# List backups
cd /var/www/quickair
./scripts/backup.sh list

# Restore from before the failed deployment
./scripts/backup.sh restore
```

---

## Database Management

### Export database for local development:

```bash
# On VPS
cd /var/www/quickair/apps/strapi/.tmp
# Download data.db to your local machine using scp
```

```bash
# On local machine
scp deploy@165.227.130.158:/var/www/quickair/apps/strapi/.tmp/data.db ~/Downloads/production-db.db
```

### ⚠️ Important Notes:

- **SQLite files are binary** - Don't commit to Git
- **Backups are local to VPS** - Consider off-site backups for production
- **Database can be large** - Monitor disk space in `/var/www/quickair-backups/`
- **Retention policy** - Auto-deployment keeps last 5 backups

---

## Off-Site Backups (Recommended for Production)

For additional safety, set up automated off-site backups:

```bash
# Example: Sync backups to another server or S3
# Add to crontab
0 3 * * * rsync -avz /var/www/quickair-backups/ user@backup-server:/backups/quickair/
```

Or use a backup service like:

- AWS S3
- DigitalOcean Spaces
- Backblaze B2
- rsync.net
