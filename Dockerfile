# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./
RUN npm ci --quiet --no-audit --no-fund

# Copy source and build
COPY . .
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm run build

# Stage 2: Serve with nginx (tiny runtime footprint)
FROM nginx:alpine
COPY --from=build /app/dist/digimon-card-game-collector/browser /usr/share/nginx/html

# SPA routing: redirect all requests to index.html
RUN printf 'server {\n\
  listen 3000;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
  try_files $uri $uri/ /index.html;\n\
  }\n\
  # The old site used an Angular service worker; a 404 manifest makes it unregister.\n\
  location = /ngsw.json {\n\
  return 404;\n\
  }\n\
  location = /ngsw-worker.js {\n\
  add_header Cache-Control "no-cache";\n\
  }\n\
  # Same-origin card images so the deck image export canvas is not tainted (Garage sends no CORS).\n\
  location ^~ /card-images/ {\n\
  proxy_pass https://web-garage.takaotaku.de/;\n\
  proxy_set_header Host web-garage.takaotaku.de;\n\
  proxy_ssl_server_name on;\n\
  expires 7d;\n\
  }\n\
  location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|webp)$ {\n\
  expires 1y;\n\
  add_header Cache-Control "public, immutable";\n\
  }\n\
  }\n' > /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
