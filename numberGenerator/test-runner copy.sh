#!/bin/bash

export RABBITMQ_URL="amqp://test_user:test_pass@localhost:5673"
export METADATA_CLIENT_QUEUE="METADATA_CLIENT_QUEUE"
export DB_CLIENT_QUEUE="DB_CLIENT_QUEUE"

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
