import mongoose, { Schema, Document } from "mongoose";

export interface IRequest extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phoneNumber: string;
  location?: string;
  budget?: string;
  timeline?: string;
  requestType: string;
  description: string;
  documents?: string[];
  landSize?: string;
  landValue?: string;
  housingProposal?: string;
  titleDocument?: string;
  sharingFormula?: string;
  developmentType?: string;
  partnershipType?: string;
  title?: string;
  status: "pending" | "accepted" | "rejected";
}

const RequestSchema: Schema<IRequest> = new Schema(
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
    budget: { type: String, required: true },
    timeline: { type: String, required: true },
    requestType: {
      type: String,
      required: true,
    },
    landSize: { type: String },
    landValue: { type: String },
    housingProposal: { type: String },
    titleDocument: { type: String },
    sharingFormula: { type: String },
    partnershipType: { type: String },
    developmentType: { type: String },
    title: { type: String },
    description: { type: String },
    documents: [{ type: String }],
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRequest>("Request", RequestSchema);
