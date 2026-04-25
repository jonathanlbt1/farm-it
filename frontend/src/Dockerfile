FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first for better layer caching.
COPY package*.json ./
RUN npm ci || npm install --no-audit --no-fund

# Build the frontend application.
COPY . .
RUN npm run build


FROM nginx:1.27-alpine AS production

# Custom nginx config with SPA fallback and static asset caching.
RUN cat > /etc/nginx/conf.d/default.conf <<'EOF'
server {
	listen 80;
	server_name _;

	root /usr/share/nginx/html;
	index index.html;

	gzip on;
	gzip_types text/plain text/css application/javascript application/json image/svg+xml;
	gzip_min_length 1024;

	location / {
		try_files $uri /index.html;
	}

	location = /service-worker.js {
		add_header Cache-Control "no-cache";
		try_files $uri =404;
	}

	location ~* \.(?:js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$ {
		expires 30d;
		add_header Cache-Control "public, max-age=2592000, immutable";
		try_files $uri =404;
	}
}
EOF

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
	CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
