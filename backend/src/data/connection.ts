import { Sequelize } from "sequelize";

export let sequelize: Sequelize;

export const connectDB = async () => {
  // 1. Use DATABASE_URL if it exists (for Render), otherwise fall back to local string
  const conn =
    process.env.DATABASE_URL ||
    `postgres://${process.env.DATABASE_ADMIN}:${process.env.DATABASE_PASSWORD}@localhost:5432/${process.env.DATABASE_NAME}`;

  sequelize = new Sequelize(conn, {
    logging: false,
    // 2. Add dialectOptions for SSL
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Required for Supabase/Render
      },
    },
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
