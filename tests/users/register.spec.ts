import request from "supertest";
import { DataSource } from "typeorm";
import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";

describe("POST /auth/register", () => {
   let db: DataSource;

   beforeAll(async () => {
      db = await AppDataSource.initialize();
   });

   beforeEach(async () => {
      // Databse truncate
      await db.dropDatabase();
      await db.synchronize();
   });

   afterAll(async () => {
      await db.destroy();
   });

   describe("Given all fields", () => {
      it("should return status code 201", async () => {
         // AAA
         // Arange
         const userData = {
            firstName: "Abhishek",
            lastName: "Gupta",
            email: "abhi@abhi.com",
            password: "password",
         };
         // Act
         const res = await request(app).post("/auth/register").send(userData);
         // Assert
         expect(res.statusCode).toBe(201);
      });

      it("should return valid json response", async () => {
         // Arange
         const userData = {
            firstName: "Abhishek",
            lastName: "Gupta",
            email: "abhi@abhi.com",
            password: "password",
         };
         // Act
         const res = await request(app).post("/auth/register").send(userData);
         // Assert
         expect(res.headers["content-type"]).toEqual(
            expect.stringContaining("json"),
         );
      });

      it("should return valid json response", async () => {
         // Arange
         const userData = {
            firstName: "Abhishek",
            lastName: "Gupta",
            email: "abhi@abhi.com",
            password: "password",
         };
         // Act
         await request(app).post("/auth/register").send(userData);
         // Assert
         const userRepository = db.getRepository(User);
         const users = await userRepository.find();

         expect(users).toHaveLength(1);
         expect(users[0].firstName).toBe(userData.firstName);
         expect(users[0].lastName).toBe(userData.lastName);
         expect(users[0].email).toBe(userData.email);
      });

      it("should return the id of the created user", async () => {
         // Arange
         const userData = {
            firstName: "Abhishek",
            lastName: "Gupta",
            email: "abhi@abhi.com",
            password: "password",
         };
         // Act
         const res = await request(app).post("/auth/register").send(userData);
         // Assert
         expect(res.body).toHaveProperty("id");
         const userRepository = db.getRepository(User);
         const users = await userRepository.find();
         expect((res.body as Record<string, string>).id).toBe(users[0].id);
      });

      it("should assign a customer tole", async () => {
         // Arange
         const userData = {
            firstName: "Abhishek",
            lastName: "Gupta",
            email: "abhi@abhi.com",
            password: "password",
         };
         // Act
         await request(app).post("/auth/register").send(userData);
         // Assert
         const userRepository = db.getRepository(User);
         const users = await userRepository.find();
         expect(users[0]).toHaveProperty("role");
         expect(users[0].role).toBe(Roles.CUSTOMER);
      });

      it("should store the hashed password", async () => {
         // Arange
         const userData = {
            firstName: "Abhishek",
            lastName: "Gupta",
            email: "abhi@abhi.com",
            password: "password",
         };
         // Act
         await request(app).post("/auth/register").send(userData);
         // Assert
         const userRepository = db.getRepository(User);
         const users = await userRepository.find();

         expect(users[0].password).not.toBe(userData.password);
         expect(users[0].password).toHaveLength(60);
         expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
      });
   });
   describe("Fields are missing", () => {});
});
