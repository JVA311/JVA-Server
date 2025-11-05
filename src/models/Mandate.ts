import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

// Define an interface for TypeScript typing
export interface IMandate extends Document {
  fullName: string;
  email: string;
  password: string;
  role: "Landowner" | "Investor" | "Mandate" | "Admin";
  category: "Individual" | "Cooperative" | "Government";
  title: string;
  trackRecord: string;
  capacityExpertise: string;
  specialization: string;
  companyName: string;
  phoneNumber: string;
  totalRequest: number;
  active: number;
  matched: number;
  availableMatches: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const MandateSchema: Schema<IMandate> = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Fullname is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["Landowner", "Investor", "Mandate", "Admin"],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      enum: ["Individual", "Cooperative", "Government"],
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    trackRecord: {
      type: String,
      trim: true,
      default: "",
    },
    capacityExpertise: {
      type: String,
      trim: true,
      default: "",
    },
    specialization: {
      type: String,
      trim: true,
      default: "",
    },
    companyName: {
      type: String,
      trim: true,
      default: "",
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: "",
    },
    totalRequest: { type: Number, default: 0 },
    active: { type: Number, default: 0 },
    matched: { type: Number, default: 0 },
    availableMatches: { type: Number, default: 0 },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

MandateSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Create the model
const Mandate = mongoose.model<IMandate>("Mandate", MandateSchema);

export default Mandate;
