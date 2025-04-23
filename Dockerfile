# Use node:18-alpine as base image
FROM node:18-alpine

WORKDIR /usr/src/app

# Install system dependencies first
RUN apk add --no-cache \
    python3 \
    py3-pip \
    gcc \
    python3-dev \
    musl-dev \
    bash \
    # Add these for potential native dependencies
    make \
    g++ \
    # Ensure venv is available
    py3-virtualenv

# Copy Python requirements and package.json files
COPY src/yahoo-client/utility/python/common/requirements.txt ./requirements.txt
COPY package*.json ./

# Create and activate virtual environment, install dependencies
RUN python3 -m venv /venv && \
    /venv/bin/pip install --upgrade pip && \
    /venv/bin/pip install --no-cache-dir -r requirements.txt

# Install Node.js dependencies
RUN npm ci

# Set environment variables
ENV PATH="/venv/bin:$PATH"
ENV PYTHONPATH="/usr/src/app/src/yahoo-client/utility/python"
ENV PYTHONUNBUFFERED=1
ENV NODE_ENV=docker

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Setup wait-for-it script
COPY wait-for-it.sh .
RUN chmod +x ./wait-for-it.sh

# Start the application
CMD ["./wait-for-it.sh", "mongodb:27017", "--", "npm", "run", "start:dev"]