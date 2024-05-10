import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const swaggerOptions = (API_URI: string) => {
  return {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Phone Number API",
        version: "1.0.0",
        description: "API for managing phone numbers",
      },
      servers: [
        {
          url: API_URI,
          description: "Development Server",
        },
      ],
      components: {
        schemas: {
          PhoneNumber: {
            type: "object",
            required: ["countryCode", "nationalNumber", "countryCallingCode"],
            properties: {
              countryCode: {
                type: "string",
                description: "The country code part of the phone number",
              },
              nationalNumber: {
                type: "string",
                description: "The national number part of the phone number",
              },
              countryCallingCode: {
                type: "string",
                description: "The international country calling code",
              },
              isMobile: {
                type: "boolean",
                description: "Whether the phone number is a mobile number",
              },
            },
          },
        },
      },
    },
    apis: [path.join(__dirname, "./routes/*.js")],
  };
};

const swaggerSpec = (API_URI: string) => swaggerJsdoc(swaggerOptions(API_URI));

export default swaggerSpec;
