import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/dbConnection";
import cors from "cors";
import routes from "./routes/routes";
import errorHandler from "./middlewares/error";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(errorHandler);

// Routes
app.use("/", routes);

// Start server
app.listen(PORT, () => {
  connectDB()
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
