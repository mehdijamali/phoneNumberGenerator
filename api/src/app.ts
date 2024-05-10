import express from "express";
import phoneNumberRouter from "./routes/phone-number.js";
import { connect } from "./db/connection.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

const app = express();
const port = process.env.PORT || 5400;
const host = process.env.API_HOST || "localhost";

const DB_URI =
  process.env.MONGO_DB_URI || "mongodb://api_user:api_password@localhost:27019";

const DB_NAME = process.env.MONGO_DB_NAME || "phoneNumbers";

if (!DB_URI || !port) {
} else {
  const swaggerDocs = swaggerSpec(`http://${host}:${port}/api`);
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  await connect(DB_URI, DB_NAME);

  app.use(express.json());
  app.use("/api/phone-numbers", phoneNumberRouter);

  app.listen(port, () => {
    console.log(`API is up and running on port ${port}`);
  });
}
