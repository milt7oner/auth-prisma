import express from "express";
import { PrismaClient } from "@prisma/client";
import { checkApiKey } from "./middlewares/auth.handler";
import userRoutes from "../src/user/user.routes";
import authRoutes from "../src/auth/auth.routes";

import cors from "cors";
import {
  errorHandler,
  logErrors,
  boomErrorHandler,
} from "./middlewares/error.handler";
// import swagger from "./routes/v1/swagger";
import "./utils";
// import { Server as SocketIOServer } from "socket.io";
import http from "http";

const app = express();
const prisma = new PrismaClient();
const server = http.createServer(app);


// Middleware para el manejo de JSON y CORS
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  }),
);

// Monta la documentación Swagger en '/api-docs'
// app.use("/api-docs", swagger.serve, swagger.setup);
// routesV1(app);

// Middlewares para el manejo de errores
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

// Ruta de prueba para el endpoint '/'
app.get("/", (req, res) => {
  res.send("¡Hola Mundo!");
});
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
// Ruta de prueba para el webhook
app.post("/webhook", (req, res) => {
  const payload = req.body;
  console.log("Webhook recibido:", payload);
  res.status(200).send("Webhook recibido");
});

// Inicializa el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});