#!/bin/bash

CONTAINER_NAME="log4j-vulnerable-app"
COMPOSE_FILE="docker-compose.yml"

case "$1" in
    start)
        echo "Starting vulnerable Log4j container..."
        docker-compose -f $COMPOSE_FILE up -d --build
        echo "Container started on http://localhost:8081"
        echo "Flag file location: /app/flag.txt inside container"
        ;;
    stop)
        echo "Stopping vulnerable Log4j container..."
        docker-compose -f $COMPOSE_FILE down
        echo "Container stopped"
        ;;
    status)
        if docker ps | grep -q $CONTAINER_NAME; then
            echo "Container is running on http://localhost:8081"
        else
            echo "Container is not running"
        fi
        ;;
    *)
        echo "Usage: $0 {start|stop|status}"
        exit 1
        ;;
esac 