import amqp, { Message } from "amqplib";
import { getPhoneNumberMetadata } from "./utils.js";
import mqConnection, { RabbitMQConnection } from "./connection.js";

export interface MetaDataRequest {
  requestId: string;
  phoneNumber: number;
}

export async function startService(): Promise<RabbitMQConnection> {
  const requestQueue =
    process.env.METADATA_CLIENT_QUEUE || "METADATA_CLIENT_QUEUE";

  if (!mqConnection.connection) await mqConnection.connect();

  mqConnection.consume(requestQueue, handleRequest);

  return mqConnection;
}

async function handleRequest(
  request: MetaDataRequest,
  channel: amqp.Channel | null
): Promise<void> {
  const responseQueue = process.env.DB_CLIENT_QUEUE || "DB_CLIENT_QUEUE";

  const number = getPhoneNumberMetadata(Number(request.phoneNumber));
  if (number) {
    await channel?.assertQueue(responseQueue, { durable: true });

    const response = {
      requestId: request.requestId,
      phoneNumber: request.phoneNumber,
      metadata: number,
    };

    await channel?.sendToQueue(
      responseQueue,
      Buffer.from(JSON.stringify(response)),
      {
        persistent: false,
      }
    );

    console.log(request, response);

    console.log(
      `Metadata Client - Generated number for request ${request.requestId}`
    );
  } else
    console.log(
      `Metadata Client - Invalid Number ${request.phoneNumber} for ${request.requestId}`
    );
}

startService().catch(console.warn);
