import amqp, { Message } from "amqplib";
import { getPhoneNumberMetadata } from "./utils.ts";

interface Request {
  requestId: string;
  phoneNumber: number;
}

async function startService() {
  const conn = await amqp.connect("amqp://localhost");
  const channel = await conn.createChannel();
  const queueName = "phone_number_responses";

  await channel.assertQueue(queueName, { durable: true });
  channel.consume(queueName, async (msg: Message | null) => {
    if (msg !== null) {
      const request = JSON.parse(msg.content.toString());

      console.log(request);

      const response = await handleRequest(request, channel);
      console.log(response);
      channel.ack(msg);
    }
  });

  // Publishing a test request
  //   const testRequest = {
  //     id: "test456",
  //   };
  //   channel.sendToQueue(queueName, Buffer.from(JSON.stringify(testRequest)), {
  //     persistent: true,
  //   });

  //   setInterval(() => {
  //     channel.sendToQueue(queueName, Buffer.from(JSON.stringify(testRequest)), {
  //       persistent: true,
  //     });
  //   }, 1000);
}

async function handleRequest(request: Request, channel: amqp.Channel) {
  //   const response = {
  //     requestId: request.id,
  //     phoneNumber: request.phoneNumber,
  //   };

  //   console.log(request);

  const number = getPhoneNumberMetadata(request.phoneNumber);

  //   console.log(number);

  //   channel.sendToQueue(
  //     "phone_number_responses",
  //     Buffer.from(JSON.stringify(response)),
  //     {
  //       persistent: true,
  //     }
  //   );

  if (number) {
    console.log(number);
  }
  return `Metadata Client - Generated number for request ${request.requestId}`;
}

startService().catch(console.warn);
