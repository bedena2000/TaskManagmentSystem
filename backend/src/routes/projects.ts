import express from "express";
import * as z from "zod";
import { Project } from "../data/models/Project";
import { ProjectType } from "../types/models";
import jwt from "jsonwebtoken";

const projectValidation = z.object({
  title: z.string("Title is required"),
  description: z.string().optional(),
});

export const projectsRouter = express.Router();

projectsRouter.post("/project", async (req, res) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log(secret);
    console.log(token);
    const decoded = jwt.verify(token, secret) as { id: number };
    const userId = decoded.id;
    console.log(decoded);
    console.log(userId);

    const parsedProject = projectValidation.safeParse(req.body);

    if (!parsedProject.success) {
      const formattedErrors = parsedProject.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }));
      return res.status(400).json({
        message: "Invalid input data",
        errors: formattedErrors,
      });
    }

    const { title, description } = parsedProject.data;

    const newProject: ProjectType = await Project.create({
      name: title,
      description: description,
      status: "active",
      userId: userId,
    });

    return res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

projectsRouter.get("/project", async (req, res) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, secret) as { id: number };
    const userId = decoded.id;

    const allProjects = await Project.findAll({
      where: {
        userId,
      },
    });

    return res.status(200).json(allProjects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});
