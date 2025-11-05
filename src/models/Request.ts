import mongoose, { Schema, Document } from "mongoose";

export interface IRequest extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phoneNumber: string;
  location?: string;
  budget?: number;
  timeline?: string;
  requestType: string;
  description: string;
  documents?: string[];
}

const RequestSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    location: { type: String, required: true },
    budget: { type: Number, required: true },
    timeline: { type: String, required: true },
    requestType: {
      type: String,
      required: true,
    },
    description: { type: String },
    documents: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRequest>("Request", RequestSchema);
