import amqp, { Message } from "amqplib";
import { getPhoneNumberMetadata } from "./utils.ts";
import mqConnection, { RabbitMQConnection } from "./connection.ts";

export interface MetaDataRequest {
  id: string;
  phoneNumber: number;
}

export async function startService(): Promise<RabbitMQConnection> {
  const requestQueue =
    process.env.METADATA_CLIENT_QUEUE || "phone_number_responses";

  if (!mqConnection.connection) await mqConnection.connect();

  mqConnection.consume(requestQueue, handleRequest);

  return mqConnection;
}

async function handleRequest(
  request: MetaDataRequest,
  channel: amqp.Channel | null
): Promise<void> {
  const responseQueue = process.env.METADATA_CLIENT_QUEUE || "DB_CLIENT_QUEUE";

  const number = getPhoneNumberMetadata(Number(request.phoneNumber));
  if (number) {
    await channel?.assertQueue(responseQueue, { durable: true });

    const response = {
      id: request.id,
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

    console.log(`Metadata Client - Generated number for request ${request.id}`);
  } else
    console.log(
      `Metadata Client - Invalid Number ${request.phoneNumber} for ${request.id}`
    );
}

startService().catch(console.warn);
