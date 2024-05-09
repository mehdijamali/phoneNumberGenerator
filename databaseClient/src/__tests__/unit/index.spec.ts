import { connect } from "amqplib";
import dotenv from "dotenv";
import * as service from "../../index";

dotenv?.config();
jest.mock("amqplib", () => {
  return {
    connect: jest.fn().mockImplementation(() => {
      return {
        createChannel: jest.fn().mockResolvedValue({
          assertQueue: jest.fn().mockResolvedValue({}),
          sendToQueue: jest.fn().mockResolvedValue({}),
          consume: jest.fn(),
          close: jest.fn(),
        }),
      };
    }),
  };
});
jest.mock("../../rabbitmq/connection", () => {
  const originalModule = jest.requireActual("../../rabbitmq/connection");

  return {
    __esModule: true,
    ...originalModule,
    RabbitMQConnection: jest.fn().mockImplementation(() => {
      return {
        connectRabbitMQ: jest.fn().mockResolvedValue(true),
        consume: jest
          .fn()
          .mockImplementation((name) => console.log("name", name)),
        channel: {
          sendToQueue: jest.fn(),
          assertQueue: jest.fn(),
          cancel: jest.fn(),
        },
        connect: jest.fn(),
        disconnect: jest.fn(),
      };
    }),
  };
});

describe("Index", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });
  it("should call connect with the correct URL", async () => {
    const expectedUrl = `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
    await service.startService();

    expect(connect).toHaveBeenCalledWith(expectedUrl);
  });
});
