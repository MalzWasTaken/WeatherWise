import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), "backend", ".env") });

console.log(dotenv.config());

export const development = {
  client: "postgresql",
  connection: {
    database: process.env.DEV_DB,
    user: process.env.DEV_USER,
    password: process.env.DEV_PASSWORD,
    host: process.env.DEV_HOST,
    port: process.env.DEV_PORT,
  },
  migrations: {
    directory: "./migrations",
    tableName: "knex_migrations",
  },
  seeds: {
    directory: "./seeds",
  },
};

export const production = {
  client: "postgresql",
  connection: {
    database: process.env.DEV_DB,
    user: process.env.DEV_USER,
    password: process.env.DEV_PASSWORD,
    host: process.env.DEV_HOST,
    port: process.env.DEV_PORT,
  },
  migrations: {
    tableName: "knex_migrations",
  },
};

export default { development, production };
