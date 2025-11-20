import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/dbConnection";
import cors from "cors";
import routes from "./routes/routes";
import morgan from "morgan";
// import http from "http";
// import { Server } from "socket.io";

// Load environment variables
dotenv.config();

const app = express();

// Logging
app.use(morgan("dev"));

// Middleware
app.use(cors());
app.use(express.json());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*"
//   },
// });

// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);
// });

// server.listen(3001, () => {
//   console.log("Socket.io server running on http://localhost:3001");
// });
const PORT = process.env.PORT;

// Routes
app.use("/", routes);

// Start server
app.listen(PORT, () => {
  connectDB();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
