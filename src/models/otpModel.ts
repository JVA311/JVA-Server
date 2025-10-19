import mongoose, { Document, Schema } from "mongoose";

export interface IOtp extends Document {
  email: string;
  code: string;
  expiresAt: Date;
  purpose: "register" | "login" | "reset";
}

const otpSchema = new Schema<IOtp>({
  email: { type: String, required: true },
  code: { type: String, required: true },
  purpose: {
    type: String,
    enum: ["register", "login", "reset"],
    required: true,
  },
  expiresAt: { type: Date, required: true },
});

export default mongoose.model<IOtp>("Otp", otpSchema);
