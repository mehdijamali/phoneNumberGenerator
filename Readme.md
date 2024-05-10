# **Phone Number generator:**

## Overview

The Phone Number Generator is a project that consists of a pipeline designed to generate random phone numbers, enrich them with metadata, and store them in a database for retrieval.

![image](https://github.com/mehdijamali/phoneNumberGenerator/assets/9283591/6ffe8528-5935-4726-9145-da0fa4b62d2f)

### **Data Flow**

The process begins when a request is placed on a message queue, which is consumed by the phone number generator service. Each generated number is then published to another channel, specifically set up to be consumed by the Metadata Client service. This service enriches the phone numbers with metadata, such as the country of origin. Subsequently, the enriched data is sent to another channel, where the Database Client service consumes and stores it in a database.

### **Services Overview**

1. **Number Generator Service**
   - This service generates random phone numbers ranging between 10,000,000,000 and 999,999,999,999.
   - The numbers generated are random and might not correspond to valid phone numbers assigned to any specific country.
   - The generated numbers are pushed onto a RabbitMQ channel, where they are available for the next service to process with additional metadata.
2. **Metadata Client**
   - Upon initialization, this service subscribes to a RabbitMQ channel to consume numbers generated by the Number Generator Service.
   - It adds metadata such as the country of origin to each phone number before forwarding them to the Database Client service via another RabbitMQ channel.
   - If a number is not a valid phone number, it will be discarded from the pipeline.
3. **Database Client**
   - This service subscribes to the response channel of the Metadata Client.
   - It populates a MongoDB database with the processed data.
4. **Database**
   - Utilizes MongoDB to store phone numbers along with their metadata.
5. **API Service**

   - An API service is included to retrieve data from the database.
   - It also allows the generation of new numbers by placing requests on RabbitMQ

![image](https://github.com/mehdijamali/phoneNumberGenerator/assets/9283591/36e6d898-9478-4e87-9029-d8f54f24ee16)

---

# Usage

## Prerequisites

Make sure Docker and Docker Compose are installed on your system. You can verify their installation by running `docker -v` and `docker-compose -v` in your terminal. If these are not installed, please follow the installation guides available on the [Docker website](https://www.docker.com/get-started).

## Running the Project

After cloning the repository, navigate to the root directory of the project and run the following command to start all services in detached mode:
<br/>

```bash
docker-compose up -d
```

This command starts all the containers defined in the `docker-compose.yml` file in the background.

## Viewing Logs

To view the logs of a specific service, use the `docker logs` command with the container name. Please replace `[container_name]` with the actual name of the container you wish to inspect:
<br/>

```bash
docker logs [container_name] -f
```

**Example**:
<br/>

```bash
docker logs number_generator_service -f
```

This command will continuously output the logs from the `number_generator_service` container.

## API Access

The API is available at port `3000` by default. If this port is already in use on your system, you can change the port mapping in the `docker-compose.yml` file and restart the services.

To access the API, navigate to:
<br>

```
http://localhost:3000/api
```

### API Documentation

API documentation and interactive endpoints can be accessed via:

```
http://localhost:3000/api/docs
```

This documentation is done using OpenAPI specification and using [Swagger](https://swagger.io/) provides a user-friendly interface to interact with the API endpoints directly from your browser.

## Testing

### Unit Testing

Unit tests for services are implemented using Jest. To execute these tests, navigate to the directory of each service and run:
<br/>

```bash
npm run test:unit
```

This command will execute all unit tests defined in the service's directory.

### Integration Testing

Integration tests can be executed with the following command:
<br/>

```bash
npm run test:integration:run
```

This command executes a bash script that sets up the necessary environment variables and calls `docker-compose` configured specifically for testing.
