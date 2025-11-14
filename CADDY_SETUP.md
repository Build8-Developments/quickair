# Caddy Setup Instructions for QuickAir

## 1. Install Caddy (if not already installed)

```bash
sudo apt update
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

## 2. Configure DNS

Add these DNS records to your build8.dev domain:

**A Records:**

- `quickair.build8.dev` → `165.227.130.158`
- `quickair-admin.build8.dev` → `165.227.130.158`

Wait for DNS propagation (can take a few minutes to a few hours).

## 3. Copy Caddyfile to server

```bash
# On your VPS
sudo cp /var/www/quickair/Caddyfile /etc/caddy/Caddyfile

# Or manually copy the contents
sudo nano /etc/caddy/Caddyfile
# Paste the Caddyfile content
```

## 4. Create log directory

```bash
sudo mkdir -p /var/log/caddy
sudo chown caddy:caddy /var/log/caddy
```

## 5. Test and reload Caddy

```bash
# Test configuration
sudo caddy validate --config /etc/caddy/Caddyfile

# Reload Caddy (this will automatically get SSL certificates!)
sudo systemctl reload caddy

# Check status
sudo systemctl status caddy
```

## 6. Check SSL certificates

Caddy automatically obtains and renews SSL certificates from Let's Encrypt!

```bash
# View Caddy logs
sudo journalctl -u caddy -f
```

## 7. Firewall Configuration (if using UFW)

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow OpenSSH
sudo ufw enable
```

## Caddy Features (automatic):

✅ **Automatic HTTPS** - SSL certificates from Let's Encrypt  
✅ **Auto-renewal** - Certificates renew automatically  
✅ **HTTP/2** - Enabled by default  
✅ **Gzip compression** - Configured  
✅ **Security headers** - Added

## Troubleshooting:

**Check if apps are running:**

```bash
pm2 status
curl http://localhost:3000  # Frontend
curl http://localhost:1337  # Strapi
```

**Check Caddy logs:**

```bash
sudo journalctl -u caddy --no-pager -n 50
```

**Restart Caddy:**

```bash
sudo systemctl restart caddy
```

## URLs:

- **Frontend:** https://quickair.build8.dev
- **Strapi Admin:** https://quickair-admin.build8.dev
