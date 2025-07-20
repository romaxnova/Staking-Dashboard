#!/bin/bash

# Frontend deployment script for Render
echo "Starting frontend deployment..."

# Navigate to client directory
cd client

# Install dependencies
echo "Installing client dependencies..."
npm install

# Build the React app
echo "Building React application..."
npm run build

# Navigate back to root
cd ..

# Install serve globally if not present
echo "Installing serve..."
npm install -g serve

# Serve the built application
echo "Starting production server..."
serve -s client/build -l $PORT
