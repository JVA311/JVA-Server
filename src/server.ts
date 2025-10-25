import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./db/dbConnection";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import errorHandler from "./middlewares/error";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  connectDB()
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
