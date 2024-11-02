import swaggerJsDoc from "swagger-jsdoc";
import { env } from "~/env";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "cryptoview",
      version: "1.0.0",
      description: "cryptoview",
    },
    servers: [
      {
        url: env.SWAGGER_URL,
      },
    ],
  },
  apis: ["./src/app/api/*/route.ts"], // Path to the API files
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

export default swaggerSpec;
