import client, { Channel, Connection, Message } from "amqplib";
import dotenv from "dotenv";

dotenv.config();
export class RabbitMQConnection {
  connection!: Connection | null;
  channel!: Channel | null;
  connected!: Boolean;

  async connect() {
    if (this.connected && this.channel) return;
    this.connected = true;

    try {
      console.log(`Connecting to Rabbit-MQ Server`);
      this.connection = await client.connect(
        process.env.RABBITMQ_URL || "amqp://localhost:5672"
      );

      console.log(`Rabbit MQ Connection is ready`);

      this.channel = await this.connection.createChannel();

      console.log("Created RabbitMQ Channel successfully");
    } catch (error) {
      console.error(error);
      console.error(`Not connected to MQ Server`);
      this.connected = false;
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
      await this.connect();
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