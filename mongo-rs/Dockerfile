ARG MONGO_VERSION

FROM mongo:${MONGO_VERSION}

ENV MONGO_REPLICA_PORT=27019
ENV MONGO_REPLICA_HOST=localhost
ENV MONGO_INITDB_ROOT_USERNAME=api_user
ENV MONGO_INITDB_ROOT_PASSWORD=api_password
ENV MONGO_COMMAND=mongo

# Run mongo in replica set mode
ENTRYPOINT mongod --port $MONGO_REPLICA_PORT --replSet rs0 --bind_ip_all & \
    MONGOD_PID=$!; \
    # Wait for MongoDB to be up before setting up replica set
    sleep 10; \
    echo 'Setting up the replica set'; \
    $MONGO_COMMAND --port $MONGO_REPLICA_PORT --username $MONGO_INITDB_ROOT_USERNAME --password $MONGO_INITDB_ROOT_PASSWORD --eval "rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: '$MONGO_REPLICA_HOST:$MONGO_REPLICA_PORT' }] });" && \
    echo 'Replica set configured'; \
    # Keep the container running
    wait $MONGOD_PID;
