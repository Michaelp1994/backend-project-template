import "dotenv/config";
import path from "path";
import { DataSource } from "typeorm";

export const dataSource = new DataSource({
    type: "postgres",
    synchronize: true,
    url: process.env.DATABASE_URL,
    entities: [path.join(__dirname, "models", "*.{ts,js}")],
    logging: ["error", "warn", "info"],
    maxQueryExecutionTime: 500,
    migrationsRun: true,
});
