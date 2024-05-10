import { Channel } from "amqplib";
import mqConnection, { RabbitMQConnection } from "./connection";
import dotenv from "dotenv";

dotenv?.config();

export async function subscribeToChannel(
  rabbitInstance: RabbitMQConnection,
  queueName: string,
  callBack: (request: any, channel: Channel | null) => Promise<void>
): Promise<RabbitMQConnection> {
  if (!rabbitInstance?.connection) await rabbitInstance?.connectRabbitMQ();

  await rabbitInstance?.consume(queueName, callBack);

  return mqConnection;
}

export default { subscribeToChannel };
