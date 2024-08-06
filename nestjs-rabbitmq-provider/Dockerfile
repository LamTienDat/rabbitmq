FROM node:16

# Create workspace directory
WORKDIR /usr/src/app

COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy source
COPY . .

RUN npm run build

# Start the server 
CMD [ "node", "dist/main.js" ]