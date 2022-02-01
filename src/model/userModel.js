import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import Task from "./taskModel.js";
import crypto from "crypto";


const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("age must be a positive number");
        }
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(password) {
        if (password.length < 6) {
          throw new Error("Password should not be less than 6 characters");
        }
        if (password.toLowerCase().includes("password")) {
          throw new Error("Password cannot contain password");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },

    resetPasswordExpires: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

/* it a virtual database that allows mongoose to figure out the relationship.
userTask - name of the virtual
ref - name of the model
localfield - id of the user on the user model 
foreignField - id of the user on the task model (owner)
*/

schema.virtual("userTasks", {
  ref: "task",
  localField: "_id",
  foreignField: "owner",
});

schema.virtual("userVerifyEmailToken", {
  ref: "verificationEmailToken",
  localField: "_id",
  foreignField: "user",
});

// Hash the password before it saves to the database
schema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
    next();
  }
});

// Deletes all a user task when the user account is deleted
schema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

// This generate tokens for all new users
schema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRETE);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// convert the user mongo object to a json object and delete some user field
schema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.createdAt;
  delete userObject.updatedAt;
  delete userObject.avatar;
  return userObject;
};

// check if the credentials already exst in the database
schema.statics.findByCredentials = async function (email, password) {
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new Error("Incorrect Email or Password");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Incorrect Email or Password");
  }
  return user;
};

schema.methods.generatePasswordReset = async function () {
  const user = this;
  try {
    user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
    await user.save();
    return user.resetPasswordToken;
  } catch (error) {
    console.log(error);
  }
};

const userModel = mongoose.model("user", schema);
export default userModel;
