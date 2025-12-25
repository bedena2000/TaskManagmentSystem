import { User } from "./User";
import { Project } from "./Project";
import { Task } from "./Task";

export const setupAssociations = () => {
  // User → Project
  User.hasMany(Project, {
    foreignKey: "userId",
    as: "projects",
    onDelete: "CASCADE",
  });

  Project.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  // Project → Task
  Project.hasMany(Task, {
    foreignKey: "projectId",
    as: "tasks",
    onDelete: "CASCADE",
  });

  Task.belongsTo(Project, {
    foreignKey: "projectId",
    as: "project",
  });

  // User → Task (optional but recommended)
  User.hasMany(Task, {
    foreignKey: "userId",
    as: "tasks",
    onDelete: "CASCADE",
  });

  Task.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });
};
