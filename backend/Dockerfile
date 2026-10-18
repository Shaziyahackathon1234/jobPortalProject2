# ---- Backend image: Node 20 + Express API ----
# Step 1 of Docker: this file is the recipe. "docker build" turns it into an image.

# Base layer: a small Linux with Node 20 already installed (same major version you run locally)
FROM node:20-alpine

# Everything below runs inside /app in the image
WORKDIR /app

# Copy only the dependency manifests first so this layer is cached
# and "npm ci" is re-run only when package.json / package-lock.json change
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Now copy the rest of the source (controllers, routes, models, utils, index.js)
COPY . .

# Run as the non-root user that the node image provides
USER node

# Documentation only: the app listens on 8000 (index.js: process.env.PORT || 8000)
EXPOSE 8000

# Step 3 of Docker: the command a container runs when it starts
CMD ["node", "index.js"]
