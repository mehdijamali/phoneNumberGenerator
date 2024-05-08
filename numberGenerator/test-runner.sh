#!/bin/bash

export RABBITMQ_URL="amqp://generator_user:generator_password@localhost:5673"
export NUMBER_GENERATOR_QUEUE="phone_number_requests"
export METADATA_CLIENT_QUEUE="phone_number_responses"

echo "Starting RabbitMQ container for testing..."
docker-compose -f docker-compose.test.yml up -d

until [ "$(docker inspect -f {{.State.Health.Status}} numbergenerator-rabbitmq-1)" == "healthy" ]; do
  sleep 5;
  echo "Waiting for RabbitMQ to become available...";
done

echo "Running integration tests..."
npm run test:integration

echo "Stopping RabbitMQ container..."
docker-compose -f docker-compose.test.yml down
