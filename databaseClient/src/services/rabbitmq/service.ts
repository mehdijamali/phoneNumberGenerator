import { storeData } from "../db/service";
import mqConnection, { RabbitMQConnection } from "./connection";
import dotenv from "dotenv";

dotenv?.config();
export async function subscribeToDbClientChannel(): Promise<RabbitMQConnection> {
  const requestQueue = process.env.DB_CLIENT_QUEUE || "DB_CLIENT_QUEUE";

  if (!mqConnection?.connection) await mqConnection?.connectRabbitMQ();

  await mqConnection?.consume(requestQueue, storeData);

  return mqConnection;
}
