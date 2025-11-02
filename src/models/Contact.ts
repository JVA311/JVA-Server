import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage extends Document {
  userId: Types.ObjectId;
  fullName: string;
  emailAddress: string;
  phoneNumber?: string;
  consultationType: string;
  subject?: string;
  message?: string;
  createdAt: Date;
}

const ContactSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fullName: {
      type: String,
      required: true,
    },
    emailAddress: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    consultationType: {
      type: String,
    },
    subject: {
      type: String,
    },
    message: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMessage>("Contact", ContactSchema);
