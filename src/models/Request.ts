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
  residential?: string;
  commercial?: string;
  industrial?: string;
  agricultural?: string;
  mandate?: string;
  lawyer?: string;
  propertyConsultant?: string;
  buildingExpert?: string;
  title?: string
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
    residential: { type: String },
    commercial: { type: String },
    industrial: { type: String },
    agricultural: { type: String },
    mandate: { type: String },
    lawyer: { type: String },
    propertyConsultant: { type: String },
    buildingExpert: { type: String },
    title: { type: String },
    description: { type: String },
    documents: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRequest>("Request", RequestSchema);
