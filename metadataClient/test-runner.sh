#!/bin/bash

export RABBITMQ_URL="amqp://metadata_client_user:metadata_client_password@localhost:5673"
export DB_CLIENT_QUEUE="metadata_responses"
export METADATA_CLIENT_QUEUE="phone_number_responses"

echo "Starting RabbitMQ container for testing..."
docker-compose -f docker-compose.test.yml up -d

until [ "$(docker inspect -f {{.State.Health.Status}} metadataclient-rabbitmq-1)" == "healthy" ]; do
  sleep 5;
  echo "Waiting for RabbitMQ to become available...";
done

echo "Running integration tests..."
npm run test:integration

echo "Stopping RabbitMQ container..."
docker-compose -f docker-compose.test.yml down
