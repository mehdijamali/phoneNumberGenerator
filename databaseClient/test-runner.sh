#!/bin/bash

export  DB_CLIENT_QUEUE="DB_CLIENT_QUEUE"
export  METADATA_CLIENT_QUEUE="phone_number_responses"
export  RABBITMQ_URL="amqp://database_client_user:databaseclient_password@localhost:5673"
export  MONGO_DB_URI="mongodb://localhost:27017"
export  MONGO_DB_NAME="phoneNumbers"

echo "Starting RabbitMQ container for testing..."
docker-compose -f docker-compose.test.yml up -d

until [ "$(docker inspect -f {{.State.Health.Status}} databaseclient-rabbitmq-1)" == "healthy" ]; do
  sleep 5;
  echo "Waiting for RabbitMQ to become available...";
done

until [ "$(docker inspect -f {{.State.Health.Status}} databaseclient-mongodb-1)" == "healthy" ]; do
  sleep 5;
  echo "Waiting for MongoDB to become available...";
done




echo "Running integration tests..."
npm run test:integration

echo "Stopping RabbitMQ container..."
docker-compose -f docker-compose.test.yml down
