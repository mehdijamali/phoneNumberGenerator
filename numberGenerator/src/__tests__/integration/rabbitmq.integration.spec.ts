import dotenv from "dotenv";
import { RabbitMQConnection } from "../../connection";
import { startService } from "../../index";

dotenv?.config();

describe("RabbitMQ Integration", () => {
  let rabbitmq: RabbitMQConnection;
  let consumerTag: string | null;

  const requestQueue =
    process.env.NUMBER_GENERATOR_QUEUE || "phone_number_requests";

  const responseQueue =
    process.env.METADATA_CLIENT_QUEUE || "phone_number_responses";

  beforeAll(async () => {
    try {
      rabbitmq = await startService();
    } catch (error) {
      console.error("Failed to start service:", error);
    }
  });

  afterAll(async () => {
    if (rabbitmq && rabbitmq.channel && rabbitmq.connection) {
      try {
        await rabbitmq.disconnect();
      } catch (error) {
        console.error("Failed to close RabbitMQ resources:", error);
      }
    }
  });

  afterEach(async () => {
    if (rabbitmq && rabbitmq.channel && consumerTag) {
      await rabbitmq.channel.cancel(consumerTag);
      consumerTag = null;
    }
  });

  test("should process a random phone generation request and send a response to the response queue", async () => {
    const testRequest = {
      id: "test123",
    };

    await rabbitmq.channel?.assertQueue(requestQueue, { durable: true });
    await rabbitmq.channel?.assertQueue(responseQueue, { durable: true });

    rabbitmq.channel?.sendToQueue(
      requestQueue,
      Buffer.from(JSON.stringify(testRequest)),
      { persistent: true }
    );

    // Listen to the response queue
    const responsePromise = new Promise((resolve) => {
      rabbitmq.channel
        ?.consume(
          responseQueue,
          (msg) => {
            if (msg) {
              const response = JSON.parse(msg.content.toString());

              rabbitmq.channel?.ack(msg);
              resolve(response);
            }
          },
          { noAck: false }
        )
        .then((ok) => (consumerTag = ok.consumerTag));
    });

    const receivedMessage: any = await responsePromise;

    expect(receivedMessage.requestId).toEqual(testRequest.id);
    expect(receivedMessage.phoneNumber).toBeDefined();
  });
});
