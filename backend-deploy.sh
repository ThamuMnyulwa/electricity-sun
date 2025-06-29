#!/bin/bash
# Build and deploy the backend Docker image from the project root

set -e

cd backend-api

docker build -t backend-api:latest .

cd ..

echo "Backend Docker image built as backend-api:latest. Ready for deployment."
