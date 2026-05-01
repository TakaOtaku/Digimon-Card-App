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
  location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|webp)$ {\n\
    expires 1y;\n\
    add_header Cache-Control "public, immutable";\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
