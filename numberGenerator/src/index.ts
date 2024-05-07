import amqp, { Message } from "amqplib";
import { getRandomPhoneNumbers } from "./utils.ts";

interface Request {
  id: string;
}

async function startService() {
  const conn = await amqp.connect("amqp://localhost");
  const channel = await conn.createChannel();
  const queueName = "phone_number_requests";

  await channel.assertQueue(queueName, { durable: true });
  channel.consume(queueName, async (msg: Message | null) => {
    if (msg !== null) {
      const request = JSON.parse(msg.content.toString());
      const response = await handleRequest(request, channel);
      console.log(response);
      channel.ack(msg);
    }
  });

  // Publishing a test request
  const testRequest = {
    id: "test123",
  };
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(testRequest)), {
    persistent: true,
  });

  setInterval(() => {
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(testRequest)), {
      persistent: true,
    });
  }, 1000);
}

async function handleRequest(request: Request, channel: amqp.Channel) {
  const number = getRandomPhoneNumbers(); // Assuming this returns the phone number immediately
  const response = {
    requestId: request.id,
    phoneNumber: number,
  };

  channel.sendToQueue(
    "phone_number_responses",
    Buffer.from(JSON.stringify(response)),
    {
      persistent: true,
    }
  );

  return `Generated number for request ${request.id}: ${number}`;
}

startService().catch(console.warn);
