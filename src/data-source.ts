import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "test",
  password: "test",
  database: "test",
  // Dont use this. Alway false
  synchronize: false,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
