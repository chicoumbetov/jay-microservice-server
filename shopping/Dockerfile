# Use a lightweight LTS version of Node.js
FROM node

# Set working directory
WORKDIR /app/shopping

# Copy package.json and package-lock.json (if present) to leverage caching
COPY package.json .

# Install production dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 8006

# Start the application
CMD ["npm", "start"]
