import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

process.env.NODE_ENV !== "production"
  ? (URL = "mongodb://127.0.0.1:27017/task_manager")
  : (URL = process.env.MONGO_URI);

const dbConnection = async () => {
  await mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Database Connection Succesfull"));
};

export { dbConnection };
