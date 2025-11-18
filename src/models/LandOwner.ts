import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

// Define an interface for TypeScript typing
export interface ILandOwner extends Document {
  fullName: string;
  email: string;
  password: string;
  role: "Landowner" | "Investor" | "Mandate" | "Admin";
  category: "Individual" | "Cooperative" | "Government";
  landLocation: string;
  landSize: string;
  licenseNumber: string;
  documentationStatus: string;
  preferredPartnershipType: string;
  landDescription: string;
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
const LandOwnerSchema: Schema<ILandOwner> = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "fullname is required"],
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
      required: false,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["Landowner", "Investor", "Mandate", "Admin"],
      required: [true, "Select a role"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Select a category"],
      trim: true,
      enum: ["Individual", "Cooperative", "Government"],
    },
    landLocation: {
      type: String,
      default: "",
    },
    landSize: {
      type: String,
      default: "",
    },
    licenseNumber: {
      type: String,
      default: "",
    },
    documentationStatus: {
      type: String,
      default: "",
    },
    preferredPartnershipType: {
      type: String,
      default: "",
    },
    landDescription: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
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

LandOwnerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Create the model
const LandOwner = mongoose.model<ILandOwner>("LandOwner", LandOwnerSchema);

export default LandOwner;
