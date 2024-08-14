/** @type { import("drizzle-kit").Config } */

export default {
  dialect: "sqlite",
  schema: "./src/db/schema/*",
  out: "./src/db/migration",
  dbCredentials: {
    url: process.env.DATABASE_PATH || "sqlite.db",
  },
};
