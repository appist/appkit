import type { DB } from "./db";

describe("db", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
    jest.resetModules();
  });

  test("uses the default DB config", () => {
    process.env.NODE_ENV = "development";
    process.env.KIT_ENV = "development";
    process.env.KIT_DB_URI_PRIMARY = "mysql://main:whatever@0.0.0.0:3306/main";
    const { getDB } = require("./db");
    const db: DB = getDB();

    expect(db["primary"]?.client.config).toEqual({
      client: "mysql2",
      connection: {
        database: "main",
        host: "0.0.0.0",
        port: "3306",
        user: "main",
        password: "whatever",
      },
      pool: { min: 10, max: 10 },
      migrations: {
        directory: `src/db/migrate/primary`,
        extension: "ts",
        tableName: "schema_migrations",
        loadExtensions: [".ts"],
      },
      seeds: {
        directory: `src/db/seed/primary`,
        extension: "ts",
        loadExtensions: [".ts"],
      },
      useNullAsDefault: false,
    });
  });

  test("uses the DB config from the environment variables", () => {
    process.env.NODE_ENV = "production";
    process.env.KIT_ENV = "production";
    process.env.KIT_DB_URI_PRIMARY = "mysql://main:whatever@0.0.0.0:3306/main";
    process.env.KIT_DB_POOL_PRIMARY = "16";
    process.env.KIT_DB_URI_SECONDARY =
      "postgresql://main:whatever@0.0.0.0:5432/main?sslmode=disable&connect_timeout=5";
    process.env.KIT_DB_POOL_SECONDARY = "32";
    const { getDB } = require("./db");
    const db: DB = getDB();

    expect(db["primary"]?.client.config).toEqual({
      client: "mysql2",
      connection: {
        database: "main",
        host: "0.0.0.0",
        port: "3306",
        user: "main",
        password: "whatever",
      },
      pool: { min: 16, max: 16 },
      migrations: {
        directory: `dist/db/migrate/primary`,
        extension: "js",
        tableName: "schema_migrations",
        loadExtensions: [".js"],
      },
      seeds: {
        directory: `dist/db/seed/primary`,
        extension: "js",
        loadExtensions: [".js"],
      },
      useNullAsDefault: false,
    });

    expect(db["secondary"]?.client.config).toEqual({
      client: "postgres",
      connection: {
        connect_timeout: "5",
        database: "main",
        host: "0.0.0.0",
        port: "5432",
        user: "main",
        password: "whatever",
        ssl: false,
        sslmode: "disable",
      },
      pool: { min: 32, max: 32 },
      migrations: {
        directory: `dist/db/migrate/secondary`,
        extension: "js",
        tableName: "schema_migrations",
        loadExtensions: [".js"],
      },
      seeds: {
        directory: `dist/db/seed/secondary`,
        extension: "js",
        loadExtensions: [".js"],
      },
      useNullAsDefault: false,
    });
  });
});
