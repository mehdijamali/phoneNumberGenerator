import * as amqplib from "amqplib";

import { generateRandomPhoneNumbers, generateValidPhoneNumbers } from "./utils";

import mqConnection, { RabbitMQConnection } from "./connection";

export interface Request {
  id: string;
  type: "RANDOM" | "VALID";
}

export async function startService(): Promise<RabbitMQConnection> {
  if (!mqConnection.connection) await mqConnection.connect();
  mqConnection.consume(
    process.env.NUMBER_GENERATOR_QUEUE || "NUMBER_GENERATOR_QUEUE",
    handleRequest
  );

  return mqConnection;
}

async function handleRequest(
  request: Request,
  channel: amqplib.Channel | null
): Promise<void> {
  const responseQueue =
    process.env.METADATA_CLIENT_QUEUE || "METADATA_CLIENT_QUEUE";
  await channel?.assertQueue(responseQueue, { durable: true });

  const number =
    request.type === "RANDOM"
      ? generateRandomPhoneNumbers()
      : generateValidPhoneNumbers();
  const response = {
    requestId: request.id,
    phoneNumber: number,
  };

  await channel?.sendToQueue(
    responseQueue,
    Buffer.from(JSON.stringify(response)),
    {
      persistent: false,
    }
  );

  console.log(
    `Phone number generator - Generated number for request ${request.id}`
  );
}

startService().catch(console.warn);
