import mongoose, { Schema, Document } from "mongoose";

// Define an interface for TypeScript typing
export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: "Landowner" | "Investor" | "Mandate" | "admin";
  category: "Individual" | "Cooperative" | "Government";
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const UserSchema: Schema<IUser> = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "fullname is required"],
      trim: true,
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
      enum: ["Landowner", "Investor", "Mandate", "admin"],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      enum: ["Individual", "Cooperative", "Government"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

// Create the model
const User = mongoose.model<IUser>("User", UserSchema);

export default User;
