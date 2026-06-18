FROM node:18-alpine

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install --production

# Copy application files
COPY . .

# Expose port (must match your app's port)
EXPOSE 5000

# Start command
CMD ["node", "index.js"]
