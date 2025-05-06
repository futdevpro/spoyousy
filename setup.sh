#!/bin/bash

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Create necessary directories
mkdir -p src/components src/hooks src/lib src/pages src/store src/types src/utils src/styles

# Initialize git repository
git init
git add .
git commit -m "Initial commit"

echo "Setup complete! Please update the .env.local file with your API credentials." 