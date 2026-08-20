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

# Card images (~1.8GB / 19k files) are round-robined into buckets so the runtime
# image ships them as many small layers instead of one giant layer — this makes
# registry pulls resumable/cacheable per bucket on flaky connections.
RUN cd /app/dist/digimon-card-game-collector/browser/assets/images/cards && \
    for i in 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do mkdir -p /cards/$i; done && \
    i=0 && \
    for f in *; do mv "$f" /cards/$((i%16))/; i=$((i+1)); done

# Stage 2: Serve with nginx (tiny runtime footprint)
FROM nginx:alpine
# App shell + all non-card assets (small layer); the emptied cards dir comes along.
COPY --from=build /app/dist/digimon-card-game-collector/browser /usr/share/nginx/html
# Card images restored as 16 separate layers.
COPY --from=build /cards/0/  /usr/share/nginx/html/assets/images/cards/
COPY --from=build /cards/1/  /usr/share/nginx/html/assets/images/cards/
COPY --from=build /cards/2/  /usr/share/nginx/html/assets/images/cards/
COPY --from=build /cards/3/  /usr/share/nginx/html/assets/images/cards/
COPY --from=build /cards/4/  /usr/share/nginx/html/assets/images/cards/
COPY --from=build /cards/5/  /usr/share/nginx/html/assets/images/cards/
COPY --from=build /cards/6/  /usr/share/nginx/html/assets/images/cards/
COPY --from=build /cards/7/  /usr/share/nginx/html/assets/images/cards/
COPY --from=build /cards/8/  /usr/share/nginx/html/assets/images/cards/
COPY --from=build /cards/9/  /usr/share/nginx/html/assets/images/cards/
COPY --from=build /cards/10/ /usr/share/nginx/html/assets/images/cards/
COPY --from=build /cards/11/ /usr/share/nginx/html/assets/images/cards/
COPY --from=build /cards/12/ /usr/share/nginx/html/assets/images/cards/
COPY --from=build /cards/13/ /usr/share/nginx/html/assets/images/cards/
COPY --from=build /cards/14/ /usr/share/nginx/html/assets/images/cards/
COPY --from=build /cards/15/ /usr/share/nginx/html/assets/images/cards/

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
