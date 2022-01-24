import express from "express";
import cors from "cors";
import morgan from "morgan";
import { dbConnection } from "./db/database.js";
dbConnection();

import taskRouter from "./api/taskAuth/taskRouter.js";
import userRouter from "./api/userAuth/userRouter.js";

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// SendTestEmail();

// routes
app.use("/api/auth", taskRouter);
app.use("/api/auth", userRouter);

const port = process.env.PORT || 8000;

app.get("/", (_, res) => {
  res.json({ hello: "Hello" });
});

app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});
