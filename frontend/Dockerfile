# ---- Frontend image: build the Vite app, then serve the static files with nginx ----
# Two stages: the first has Node and all dev dependencies (big), the second only
# contains nginx + the built files (tiny). Only the second stage ships.

# ---------- Stage 1: build ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Where the built app should send API calls. Passed at build time because Vite
# bakes env vars into the bundle. Default = backend running on your machine.
ARG VITE_API_URL=http://localhost:8000/api/v1
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build          # output: /app/dist

# ---------- Stage 2: serve ----------
FROM nginx:1.27-alpine
# SPA routing: every path falls back to index.html so React Router works on refresh
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
