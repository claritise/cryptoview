import swaggerJsDoc from "swagger-jsdoc";

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
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/app/api/*/route.ts"], // Path to the API files
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

export default swaggerSpec;
