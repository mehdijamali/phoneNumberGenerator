import dotenv from "dotenv";
import mqConnection, {
  RabbitMQConnection,
} from "../../services/rabbitmq/connection";
import { handleRequest, MetaDataRequest } from "../../index";
import { subscribeToChannel } from "../../services/rabbitmq/service";

dotenv?.config();

describe("RabbitMQ Integration", () => {
  let rabbitmq: RabbitMQConnection = mqConnection;
  let consumerTag: string | null;

  const requestQueue =
    process.env.METADATA_CLIENT_QUEUE || "METADATA_CLIENT_QUEUE";
  const responseQueue = process.env.DB_CLIENT_QUEUE || "DB_CLIENT_QUEUE";

  beforeAll(async () => {
    try {
      if (!mqConnection?.connection) await mqConnection?.connectRabbitMQ();
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

  // TODO: check for invalid number
  test("should process a valid phone generation request and send a response to the response queue", async () => {
    // start service
    await rabbitmq.channel?.assertQueue(responseQueue, { durable: true });
    await rabbitmq.channel?.assertQueue(requestQueue, { durable: true });

    await subscribeToChannel(rabbitmq, requestQueue, handleRequest);

    const responsePromise = new Promise((resolve) => {
      rabbitmq.channel
        ?.consume(
          responseQueue,
          (msg: any) => {
            if (msg) {
              const response = JSON.parse(msg.content.toString());

              rabbitmq.channel?.ack(msg);
              resolve(response);
            }
          },
          { noAck: false }
        )
        .then((ok: any) => (consumerTag = ok.consumerTag));
    });

    const testRequest: MetaDataRequest = {
      requestId: "test-valid",
      phoneNumber: 31642420290,
    };

    rabbitmq.channel?.sendToQueue(
      requestQueue,
      Buffer.from(JSON.stringify(testRequest)),
      { persistent: true }
    );

    const receivedMessage: any = await responsePromise;

    expect(receivedMessage.requestId).toEqual(testRequest.requestId);
    expect(receivedMessage.phoneNumber).toBeDefined();
    expect(receivedMessage.metadata).toBeDefined();
  });
  test("should process an invalid phone generation request and send a response to the response queue", async () => {
    const phoneNumber = 99642420290;

    const testRequest: MetaDataRequest = {
      requestId: "test-invalid",
      phoneNumber,
    };

    await rabbitmq.channel?.assertQueue(requestQueue, { durable: true });
    await rabbitmq.channel?.assertQueue(responseQueue, { durable: true });

    rabbitmq.channel?.sendToQueue(
      requestQueue,
      Buffer.from(JSON.stringify(testRequest)),
      { persistent: true }
    );

    // Listen to the response queue
    const responsePromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        resolve("No message received for invalid number, as expected.");
      }, 5000);

      rabbitmq.channel?.consume(
        responseQueue,
        (msg) => {
          if (msg) {
            console.log(msg);

            clearTimeout(timeout);
            const response = JSON.parse(msg.content.toString());
            rabbitmq.channel?.ack(msg);
            reject(
              new Error("A message was received for an invalid phone number.")
            );
          }
        },
        { noAck: false }
      );
    });

    // Expect the promise to resolve with no message received
    await expect(responsePromise).resolves.toEqual(
      "No message received for invalid number, as expected."
    );
  });
});
