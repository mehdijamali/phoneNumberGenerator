import dotenv from "dotenv";
import { RabbitMQConnection } from "../../services/rabbitmq/connection";
import { subscribeToDbClientChannel } from "../../services/rabbitmq/service";

import { PhoneNumberMetaData } from "../../services/types";
import * as dbService from "../../services/db/service";

dotenv?.config();

jest.mock("../../services/db/service", () => ({
  storeData: jest.fn(),
}));

describe("RabbitMQ Integration", () => {
  let rabbitmq: RabbitMQConnection;
  let consumerTag: string | null;
  let spy;

  const requestQueue = process.env.DB_CLIENT_QUEUE || "DB_CLIENT_QUEUE";

  beforeAll(async () => {
    try {
      spy = jest.spyOn(dbService, "storeData");
      rabbitmq = await subscribeToDbClientChannel();
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

  test("should process a valid meta data request", async () => {
    const testRequest: PhoneNumberMetaData = {
      id: "test-valid",
      country: "NL",
      countryCallingCode: "31",
      nationalNumber: "642420290",
      isMobile: true,
    };

    await rabbitmq.channel?.assertQueue(requestQueue, { durable: true });

    await rabbitmq.channel?.sendToQueue(
      requestQueue,
      Buffer.from(JSON.stringify(testRequest)),
      { persistent: true }
    );

    await new Promise((resolve) => setTimeout(resolve, 3000));

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "test-valid",
        country: "NL",
        countryCallingCode: "31",
        nationalNumber: "642420290",
        isMobile: true,
      }),
      expect.anything()
    );
  });
});
