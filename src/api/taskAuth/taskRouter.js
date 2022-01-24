import express from "express";
const router = new express.Router();
import { authenticateUser } from "../../helper/authenticateUser.js";

import {
  handleCreateTask,
  handleGetTasks,
  handleGetSingleTask,
  handleDeleteTask,
  updateTask,
  handleGetUserTasks,
} from "./taskController.js";

router.post("/task/create", authenticateUser, handleCreateTask);
router.get("/tasks", handleGetTasks);
router.get("/me/tasks", authenticateUser, handleGetUserTasks);
router.get("/task/:id", authenticateUser, handleGetSingleTask);
router.delete("/task/delete/:id", authenticateUser, handleDeleteTask);
router.patch("/task/edit/:id", authenticateUser, updateTask);

export default router;
