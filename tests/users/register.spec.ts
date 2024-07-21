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

      it("should return 400 status code if email is already exist", async () => {
         // Arange
         const userData = {
            firstName: "Abhishek",
            lastName: "Gupta",
            email: "abhi@abhi.com",
            password: "password",
         };

         const userRepository = db.getRepository(User);
         await userRepository.save({ ...userData, role: Roles.CUSTOMER });
         // Act
         const res = await request(app).post("/auth/register").send(userData);
         const users = await userRepository.find();
         // Assert
         expect(res.statusCode).toBe(400);
         expect(users).toHaveLength(1);
      });
   });
   describe("Fields are missing", () => {
      it("should return 400 status code if email is missing", async () => {
         // Arange
         const userData = {
            firstName: "Abhishek",
            lastName: "Gupta",
            email: "",
            password: "password",
         };
         // Act
         const res = await request(app).post("/auth/register").send(userData);
         // Assert
         const repository = db.getRepository(User);
         const users = await repository.find();
         expect(res.statusCode).toBe(400);
         expect(users).toHaveLength(0);
      });
      it("should return 400 status code if firstName is missing", async () => {
         // Arange
         const userData = {
            firstName: "",
            lastName: "Gupta",
            email: "abhi@abhi.com",
            password: "password",
         };
         // Act
         const res = await request(app).post("/auth/register").send(userData);
         // Assert
         const repository = db.getRepository(User);
         const users = await repository.find();
         expect(res.statusCode).toBe(400);
         expect(users).toHaveLength(0);
      });
      it("should return 400 status code if lastName is missing", async () => {
         // Arange
         const userData = {
            firstName: "Abhishek",
            lastName: "",
            email: "abhi@abhi.com",
            password: "password",
         };
         // Act
         const res = await request(app).post("/auth/register").send(userData);
         // Assert
         const repository = db.getRepository(User);
         const users = await repository.find();
         expect(res.statusCode).toBe(400);
         expect(users).toHaveLength(0);
      });
      it("should return 400 status code if password is missing", async () => {
         // Arange
         const userData = {
            firstName: "Abhishek",
            lastName: "Gupta",
            email: "abhi@abhi.com",
            password: "",
         };
         // Act
         const res = await request(app).post("/auth/register").send(userData);
         // Assert
         const repository = db.getRepository(User);
         const users = await repository.find();
         expect(res.statusCode).toBe(400);
         expect(users).toHaveLength(0);
      });
   });

   describe("Fields are not in proper format", () => {
      it("should trim the email field", async () => {
         // Arange
         const userData = {
            firstName: "Abhishek",
            lastName: "Gupta",
            email: "      abhi@abhi.com     ",
            password: "password",
         };
         // Act
         await request(app).post("/auth/register").send(userData);
         // Assert
         const repository = db.getRepository(User);
         const users = await repository.find();
         const user = users[0];
         expect(user.email).toBe("abhi@abhi.com");
      });
      it("should return 400 if email is not valid email", async () => {
         // Arange
         const userData = {
            firstName: "Abhishek",
            lastName: "Gupta",
            email: "abhi",
            password: "password",
         };
         // Act
         const res = await request(app).post("/auth/register").send(userData);
         // Assert
         expect(res.statusCode).toBe(400);
      });
      it("should return 400 if password length is less than 8 characters", async () => {
         // Arange
         const userData = {
            firstName: "Abhishek",
            lastName: "Gupta",
            email: "abhi@abhi.com",
            password: "pas",
         };
         // Act
         const res = await request(app).post("/auth/register").send(userData);
         // Assert
         expect(res.statusCode).toBe(400);
      });
      it("should return an array of error messages if email is missing", async () => {
         // Arange
         const userData = {
            firstName: "Abhishek",
            lastName: "Gupta",
            email: "",
            password: "password",
         };
         // Act
         const res = await request(app).post("/auth/register").send(userData);
         // Assert
         // const repository = db.getRepository(User);
         // const users = await repository.find();
         // const user = users[0];
         expect(res.body).toHaveProperty("errors");
         expect(
            (res.body as Record<string, string>).errors.length,
         ).toBeGreaterThan(0);
      });
      it("should trim the firstName field", async () => {
         // Arange
         const userData = {
            firstName: "     Abhishek   ",
            lastName: "Gupta",
            email: "      abhi@abhi.com     ",
            password: "password",
         };
         // Act
         await request(app).post("/auth/register").send(userData);
         // Assert
         const repository = db.getRepository(User);
         const users = await repository.find();
         const user = users[0];
         expect(user.firstName).toBe("Abhishek");
      });
   });
});
