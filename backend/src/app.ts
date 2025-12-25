import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, sequelize } from "./data/connection";
import { initUserModel } from "./data/models/User";
import { authRouter } from "./routes/auth";
import { projectsRouter } from "./routes/projects";
import { tasksRouter } from "./routes/tasks";
import { initTaskModel } from "./data/models/Task";
import { initProjectModel } from "./data/models/Project";
import { setupAssociations } from "./data/models";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "https://taskmanagmentsystem123.netlify.app/",
    credentials: true,
  })
);
app.use(express.json());

app.use("/auth", authRouter);
app.use("/", projectsRouter);
app.use("/project", tasksRouter);

const startServer = async () => {
  // Connection to database
  await connectDB();
  initUserModel(sequelize);
  initProjectModel(sequelize);
  initTaskModel(sequelize);

  setupAssociations();

  await sequelize.sync();

  // Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();

export default app;
