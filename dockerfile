# Use the latest Node.js Alpine version as the base image
FROM zenika/alpine-chrome:with-puppeteer

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies using yarn
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Start the application
CMD [ "yarn", "start" ]
