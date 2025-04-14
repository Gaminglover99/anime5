import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import pg from 'pg';

// Get Pool constructor from pg
const { Pool } = pg;

// Set the database connection string from environment variables
const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres";

// Create postgres client for Drizzle
export const client = postgres(databaseUrl);

// Create the drizzle client
export const db = drizzle(client);

// Create a pg Pool for session store compatibility
export const pool = new Pool({
  connectionString: databaseUrl
});
