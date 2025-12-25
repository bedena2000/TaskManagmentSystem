import express from "express";
import * as z from "zod";
import { User } from "../data/models/User";
import bcrypt from "bcrypt";
import type { UserType } from "../types/models";
import jwt from "jsonwebtoken";

export const authRouter = express.Router();

const register = z.object({
  email: z.email("Email field was entered incorrectly"),
  password: z
    .string("Password field was entered incorrectly")
    .min(8, "Password should contain at least 8 symbols"),
});

authRouter.post("/register", async (req, res) => {
  try {
    const parsingResult = register.safeParse(req.body);
    if (!parsingResult.success) {
      const formattedErrors = parsingResult.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }));
      return res.status(400).json({
        message: "Invalid input data",
        errors: formattedErrors,
      });
    }

    const { email, password } = parsingResult.data;

    const existingUser = await User.findOne({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = (await User.create({
      email: email,
      password: hashedPassword,
      role: "user",
    })) as unknown as UserType;

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("REGISTRATION ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const parsingResult = register.safeParse(req.body);
    if (!parsingResult.success) {
      const formattedErrors = parsingResult.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }));
      console.log(formattedErrors);
      return res.status(400).json({
        message: "Invalid input data",
        errors: formattedErrors,
      });
    }

    const { email, password } = parsingResult.data;

    const existingUser = (await User.findOne({
      where: {
        email,
      },
    })) as unknown as UserType;

    if (!existingUser) {
      return res.status(404).json({
        message: "We can not find user with this email",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    const payload = {
      id: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
    };

    const secret = process.env.JWT_SECRET;
    console.log(secret);
    if (secret) {
      const token = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: "1d",
      });

      return res.status(200).json({
        message: "You have authenticated successfully",
        user: {
          id: existingUser.id,
          email: existingUser.email,
        },
        token,
      });
    } else {
      return res.status(500).json({ message: "Server error" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});
