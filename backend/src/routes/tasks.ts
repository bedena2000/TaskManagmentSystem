import express from "express";
import { Task } from "../data/models/Task";
import jwt from "jsonwebtoken";
import { Project } from "../data/models/Project";

export const tasksRouter = express.Router();

// GET Tasks by Project
tasksRouter.get("/:projectId/tasks", async (req, res) => {
  const secret = process.env.JWT_SECRET!;
  const { projectId } = req.params;

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, secret) as { id: number };
    const userId = decoded.id;

    const project = await Project.findOne({
      where: { id: projectId, userId: userId },
    });

    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or unauthorized" });
    }

    const tasks = await Task.findAll({
      where: { projectId: projectId },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// POST Create Task
tasksRouter.post("/:projectId/tasks", async (req, res) => {
  const secret = process.env.JWT_SECRET!;
  const { projectId } = req.params;

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, secret) as { id: number };
    const { title, description, priority } = req.body;

    const newTask = await Task.create({
      title,
      description,
      priority: priority || "medium",
      status: "todo",
      projectId: Number(projectId),
      userId: decoded.id,
    });

    return res.status(201).json(newTask);
  } catch (error) {
    return res.status(500).json({ message: "Error creating task" });
  }
});

// PATCH Update Task Status (Drag and Drop)
tasksRouter.patch("/tasks/:taskId", async (req, res) => {
  const secret = process.env.JWT_SECRET!;
  const { taskId } = req.params;
  const { status } = req.body;

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, secret) as { id: number };
    const userId = decoded.id;

    // Verify the task exists and belongs to the user
    const task = await Task.findOne({
      where: { id: taskId, userId: userId },
    });

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    // Update the status
    task.status = status;
    await task.save();

    return res.status(200).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating task status" });
  }
});

// DELETE Task
tasksRouter.delete("/tasks/:taskId", async (req, res) => {
  const secret = process.env.JWT_SECRET!;
  const { taskId } = req.params;

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, secret) as { id: number };
    const userId = decoded.id;

    // We verify the task exists AND belongs to the user in one query
    const deletedCount = await Task.destroy({
      where: {
        id: taskId,
        userId: userId, // Security check: ensures user owns the task
      },
    });

    if (deletedCount === 0) {
      return res.status(404).json({
        message: "Task not found or you don't have permission to delete it",
      });
    }

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
