const amqp = require("amqplib");

async function sendTestMessages(requestQueue, host, numMessages) {
  try {
    const RABBITMQ_URL =
      process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";
    const conn = await amqp.connect(RABBITMQ_URL);

    const channel = await conn.createChannel();

    await channel.assertQueue(requestQueue, { durable: true });

    for (let i = 0; i < numMessages; i++) {
      channel.sendToQueue(
        requestQueue,
        Buffer.from(
          JSON.stringify({
            id: i,
            type: "VALID",
          })
        ),
        { persistent: true }
      );
      console.log(`Message ${i + 1} sent to ${requestQueue}`);
    }

    setTimeout(() => {
      channel.close();
      conn.close();
    }, 500); // wait a bit before closing to ensure messages are sent
  } catch (error) {
    console.error("Failed to send messages:", error);
  }
}

// Update the 'rabbitmq' to your actual RabbitMQ host if it's different when accessed from Node.js context
sendTestMessages("NUMBER_GENERATOR_QUEUE", "localhost", 100);
