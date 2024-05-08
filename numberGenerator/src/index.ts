import amqp, { Message } from "amqplib";
import {
  generateValidPhoneNumbers,
  generateRandomPhoneNumbers,
} from "./utils.ts";

import mqConnection, { RabbitMQConnection } from "./connection.ts";

export interface Request {
  id: string;
  type: "RANDOM" | "VALID";
}

export async function startService(): Promise<RabbitMQConnection> {
  if (!mqConnection.connection) await mqConnection.connect();
  mqConnection.consume(
    process.env.NUMBER_GENERATOR_QUEUE || "phone_number_requests",
    handleRequest
  );

  return mqConnection;
}

async function handleRequest(
  request: Request,
  channel: amqp.Channel | null
): Promise<void> {
  const responseQueue =
    process.env.METADATA_CLIENT_QUEUE || "phone_number_responses";
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
