server {
    listen 80;
    server_name propertymap.komliev.studio;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name propertymap.komliev.studio;

    root /var/www/propertymap;
    index index.html;

    gzip on;
    gzip_types text / plain text / css application / json application / javascript text / xml application / xml application / xml + rss image / svg + xml;

    location / api / {
        proxy_pass http://127.0.0.1:3001/api/;
            proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X- Real - IP $remote_addr;
        proxy_set_header X - Forwarded - For $proxy_add_x_forwarded_for;
        proxy_set_header X - Forwarded - Proto $scheme;
}

location / {
    try_files $uri / index.html;
    }

location / assets / {
    expires 1y;
    add_header Cache- Control "public, immutable";
    }

    add_header X - Frame - Options "SAMEORIGIN" always;
    add_header X - Content - Type - Options "nosniff" always;
    add_header Referrer - Policy "strict-origin-when-cross-origin" always;
    add_header Permissions - Policy "geolocation=(self), microphone=(), camera=()" always;

access_log /var/log/nginx / propertymap.access.log;
error_log /var/log/nginx / propertymap.error.log;

ssl_certificate / etc / letsencrypt / live / propertymap.komliev.studio / fullchain.pem;
ssl_certificate_key / etc / letsencrypt / live / propertymap.komliev.studio / privkey.pem;
}