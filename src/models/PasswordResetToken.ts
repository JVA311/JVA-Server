import mongoose, { Schema, Document } from "mongoose";

export interface IResetOtp extends Document {
  userId: string;
  role: string;
  otp: string;
  expiresAt: Date;
}

const ResetOtpSchema = new Schema<IResetOtp>({
  userId: { type: String, required: true },
  role: { type: String, required: true }, 
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

export default mongoose.model<IResetOtp>("ResetToken", ResetOtpSchema);
