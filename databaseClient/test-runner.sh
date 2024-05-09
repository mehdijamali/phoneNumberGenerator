#!/bin/bash

export DB_CLIENT_QUEUE="DB_CLIENT_QUEUE"
export METADATA_CLIENT_QUEUE="phone_number_responses"
export RABBITMQ_DEFAULT_USER="database_client_user"
export RABBITMQ_DEFAULT_PASS="databaseclient_password"
export RABBITMQ_PORT="5673"
export RABBITMQ_HOST="localhost"
# mongo db
export MONGO_DB_HOST="localhost"
export MONGO_DB_PORT="27018"
export MONGO_INITDB_ROOT_USERNAME="database_client_user"
export MONGO_INITDB_ROOT_PASSWORD="databaseclient_password"


echo "Starting RabbitMQ container for testing..."
docker-compose -f docker-compose.test.yml up -d

until [ "$(docker inspect -f {{.State.Health.Status}} databaseclient-rabbitmq-1)" == "healthy" ]; do
  sleep 5;
  echo "Waiting for RabbitMQ to become available...";
done

until [ "$(docker inspect -f {{.State.Health.Status}}  databaseclient-mongodb-1)" == "healthy" ]; do
  sleep 5;
  echo "Waiting for MongoDB to become available...";
done




echo "Running integration tests..."
npm run test:integration



echo "Stopping RabbitMQ container..."
docker-compose -f docker-compose.test.yml down
