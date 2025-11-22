import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

// Define an interface for TypeScript typing
export interface Iinvestor extends Document {
  fullName: string;
  email: string;
  password: string;
  role: "Landowner" | "Investor" | "Mandate" | "Admin";
  category: "Individual" | "Cooperative" | "Government";
  preferredLocation: string;
  investmentType: string;
  budgetRange: string;
  projectType: string;
  organizationType: string;
  yearsOfExperience: string;
  registrationLicenseNumber: string;
  companyName: string;
  phoneNumber: string;
  isVerified: boolean;
  active: number;
  matched: number;
  availableMatches: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const InvestorSchema: Schema<Iinvestor> = new Schema(
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
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      enum: ["Individual", "Cooperative", "Government"],
    },
    preferredLocation: {
      type: String,
      default: "",
    },
    investmentType: {
      type: String,
      default: "",
    },
    budgetRange: {
      type: String,
      default: "",
    },
    projectType: {
      type: String,
      default: "",
    },
    yearsOfExperience: {
      type: String,
      default: "",
    },
    registrationLicenseNumber: {
      type: String,
      default: "",
    },
    companyName: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    active: { type: Number, default: 0 },
    matched: { type: Number, default: 0 },
    availableMatches: { type: Number, default: 0 },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

InvestorSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Create the model
const Investor = mongoose.model<Iinvestor>("Investor", InvestorSchema);

export default Investor;
