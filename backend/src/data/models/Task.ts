import { DataTypes, Model, Sequelize, Optional } from "sequelize";

interface TaskAttributes {
  id: number;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done" | "archived";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: Date;
  completedAt?: Date;
  userId?: number;
  projectId?: number;
}

interface TaskCreationAttributes
  extends Optional<TaskAttributes, "id" | "description" | "dueDate" | "completedAt" | "userId" | "projectId"> {}

export class Task extends Model<TaskAttributes, TaskCreationAttributes>
  implements TaskAttributes {
  public id!: number;
  public title!: string;
  public description?: string;
  public status!: "todo" | "in_progress" | "done" | "archived";
  public priority!: "low" | "medium" | "high" | "urgent";
  public dueDate?: Date;
  public completedAt?: Date;
  public userId?: number;
  public projectId?: number;
}

export const initTaskModel = (sequelize: Sequelize) => {
  Task.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      title: {
        type: DataTypes.STRING(150),
        allowNull: false
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      status: {
        type: DataTypes.ENUM("todo", "in_progress", "done", "archived"),
        allowNull: false,
        defaultValue: "todo"
      },

      priority: {
        type: DataTypes.ENUM("low", "medium", "high", "urgent"),
        allowNull: false,
        defaultValue: "medium"
      },

      dueDate: {
        type: DataTypes.DATE,
        allowNull: true
      },

      completedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      projectId: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "Task",
      tableName: "Task",
      freezeTableName: true,
      timestamps: true
    }
  );
};
