import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();

const connectionString =
  process.env.DATABASE_URL || "postgres://localhost:5432/katacut";

const globalForDb = globalThis as unknown as {
  _postgresClient: ReturnType<typeof postgres> | undefined;
};

const client = globalForDb._postgresClient || postgres(connectionString);
if (process.env.NODE_ENV !== "production") {
  globalForDb._postgresClient = client;
}

export const db = drizzle(client, { schema });
