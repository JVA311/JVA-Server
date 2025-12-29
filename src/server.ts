import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/dbConnection";
import cors from "cors";
import routes from "./routes/routes";
import morgan from "morgan";

// Load environment variables
dotenv.config();

const app = express();

// Logging
app.use(morgan("dev"));

// Middleware
app.use(cors());
app.use(express.json()); 

const PORT = process.env.PORT;

// Routes
app.use("/", routes);

// Start server
app.listen(PORT, () => {
  connectDB();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
