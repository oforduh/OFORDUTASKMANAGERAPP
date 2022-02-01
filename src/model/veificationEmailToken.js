import mongoose from "mongoose";
import validator from "validator";
import dotenv from "dotenv";
dotenv.config();

const schema = new mongoose.Schema(
  {
    verifyEmailToken: {
      type: String,
      required: false,
    },

    verifyEmailExpires: {
      type: Date,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
  },
  { timestamps: true }
);

const verificationEmailTokenModel = mongoose.model(
  "verificationEmailToken",
  schema
);
export default verificationEmailTokenModel;
