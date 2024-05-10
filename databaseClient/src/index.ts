import dotenv from "dotenv";
import { subscribeToDbClientChannel } from "./services/rabbitmq/service.js";

dotenv?.config();

export async function startService(): Promise<void> {
  await subscribeToDbClientChannel();
}

startService().catch(console.warn);
