import { Channel, Connection, Message, connect } from "amqplib";
import dotenv from "dotenv";

dotenv?.config();

export class RabbitMQConnection {
  connection!: Connection | null;
  channel!: Channel | null;
  connected!: Boolean;

  async connectRabbitMQ(retries: number = 10, backoff: number = 1000) {
    if (this.connected && this.channel) return;

    const RABBITMQ_URL =
      process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";

    while (retries > 0) {
      try {
        console.log(
          `Attempting to connect to RabbitMQ Server. Retries left: ${retries}`
        );
        this.connection = await connect(RABBITMQ_URL);
        console.log("RabbitMQ Connection is ready");

        this.channel = await this.connection.createChannel();
        console.log("Created RabbitMQ Channel successfully");

        this.connected = true;
        return;
      } catch (error) {
        console.error("Connection to RabbitMQ failed:", error);
        retries--;
        if (retries === 0) {
          console.error("Max retries reached. Failed to connect to RabbitMQ.");
          this.connected = false;
          throw error;
        }
        console.log(`Waiting ${backoff}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, backoff));
        backoff *= 2; // Exponential backoff
      }
    }
  }

  async sendToQueue(queue: string, message: any) {
    try {
      await this.channel?.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(message))
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async consume(
    queue: string,
    callBack?: (request: any, channel: Channel | null) => Promise<void>
  ) {
    if (!this.channel) {
      await this.connectRabbitMQ();
    }
    await this.channel?.assertQueue(queue, { durable: true });
    await this.channel?.consume(queue, async (msg: Message | null) => {
      if (msg !== null) {
        const request = JSON.parse(msg.content.toString());
        if (typeof callBack === "function") {
          await callBack(request, this.channel);
        }
        this.channel?.ack(msg);
      }
    });
  }

  async disconnect() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      this.connected = false;
      console.log("Disconnected RabbitMQ Channel and Connection");
    } catch (error) {
      console.error("Error disconnecting RabbitMQ:", error);
      throw error;
    }
  }
}

const mqConnection = new RabbitMQConnection();

export default mqConnection;
