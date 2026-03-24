# Sovereign — Self-Hosting Deployment Guide

## Prerequisites

- Node.js 18+ and npm
- nginx (or any static file server)
- SSH access to target server

## Build

```bash
npm install
npm run build
```

This produces the `out/` directory containing the complete static site.

## Deploy to Server

Copy the `out/` directory to your server:

```bash
# Option 1: rsync (incremental, fastest for updates)
rsync -avz --delete out/ user@server:/var/www/sovereign/out/

# Option 2: scp (simple, full copy)
scp -r out/ user@server:/var/www/sovereign/
```

## nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/sovereign/out;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    # Correct MIME types for JS modules and Workers
    types {
        application/javascript js mjs;
        text/css css;
    }

    # Cache static assets aggressively
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/html text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1000;
}
```

Test and reload nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Verify

```bash
curl -s http://your-domain.com/ | head -20
# Should show HTML with <title>Sovereign</title>

curl -s -o /dev/null -w "%{http_code}" http://your-domain.com/calibration/
# Should return 200
```

## Updating

```bash
# On build machine
git pull
npm run build

# Deploy
rsync -avz --delete out/ user@server:/var/www/sovereign/out/
```

No server restart needed — nginx serves static files directly.

## Notes

- No backend required — simulation runs entirely in the browser via Web Worker
- World Bank data refresh fetches directly from the browser to `api.worldbank.org` (no proxy needed)
- The `out/` directory is ~2MB and contains all assets including fonts and map data
