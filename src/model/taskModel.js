import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const schema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },

    // user and task relationship
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
  },
  { timestamps: true }
);

const taskModel = mongoose.model("task", schema);
export default taskModel;
