import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface ProjectAttributes {
  id: number;
  name: string;
  description?: string;
  status: "active" | "completed" | "archived";
  startDate?: Date;
  endDate?: Date;
  userId: number;
}

interface ProjectCreationAttributes
  extends Optional<
    ProjectAttributes,
    "id" | "description" | "startDate" | "endDate"
  > {}

export class Project
  extends Model<ProjectAttributes, ProjectCreationAttributes>
  implements ProjectAttributes
{
  public id!: number;
  public name!: string;
  public description?: string;
  public status!: "active" | "completed" | "archived";
  public startDate?: Date;
  public endDate?: Date;
  public userId!: number;
}

export const initProjectModel = (sequelize: Sequelize) => {
  Project.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM("active", "completed", "archived"),
        allowNull: false,
        defaultValue: "active",
      },

      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Project",
      tableName: "projects",
      freezeTableName: true,
      timestamps: true,
    }
  );
};
