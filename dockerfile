# Use an official Node.js image as the base
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Install AWS CLI for S3 uploads
RUN apt-get update && apt-get install -y awscli


# Ensure report directories exist
RUN mkdir -p test-reports/html-report test-reports/junit test-reports/jest-stare coverage

# Run Jest tests with reports and upload script
CMD ["npm", "run", "test:CI"]
