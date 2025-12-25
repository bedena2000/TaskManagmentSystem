import { Sequelize } from "sequelize";

export let sequelize: Sequelize;

export const connectDB = async () => {
  const conn = `postgres://${process.env.DATABASE_ADMIN}:${process.env.DATABASE_PASSWORD}@localhost:5432/${process.env.DATABASE_NAME}`;

  sequelize = new Sequelize(conn, {
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.log("Database connection established.");
    return sequelize;
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
