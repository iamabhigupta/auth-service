import request from "supertest";
import { DataSource } from "typeorm";
import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";
import { isJwt } from "../utils";

describe("POST /auth/register", () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    // Database truncate
    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("Given all fields", () => {
    it("should return the 201 status code", async () => {
      // Arrange
      const userData = {
        firstName: "Abhishek",
        lastName: "Gupta",
        email: "abhishek@codersgyan.com",
        password: "password",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      expect(response.statusCode).toBe(201);
    });

    it("should return valid json response", async () => {
      // Arrange
      const userData = {
        firstName: "Abhishek",
        lastName: "Gupta",
        email: "abhishek@codersgyan.com",
        password: "password",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert application/json utf-8
      expect(
        (response.headers as Record<string, string>)["content-type"],
      ).toEqual(expect.stringContaining("json"));
    });

    it("should persist the user in the database", async () => {
      // Arrange
      const userData = {
        firstName: "Abhishek",
        lastName: "Gupta",
        email: "abhishek@codersgyan.com",
        password: "password",
      };
      // Act
      await request(app).post("/auth/register").send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(1);
      expect(users[0].firstName).toBe(userData.firstName);
      expect(users[0].lastName).toBe(userData.lastName);
      expect(users[0].email).toBe(userData.email);
    });

    it("should return an id of the created user", async () => {
      // Arrange
      const userData = {
        firstName: "Abhishek",
        lastName: "Gupta",
        email: "abhishek@codersgyan.com",
        password: "password",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      expect(response.body).toHaveProperty("id");
      const repository = connection.getRepository(User);
      const users = await repository.find();
      expect((response.body as Record<string, string>).id).toBe(users[0].id);
    });

    it("should assign a customer role", async () => {
      // Arrange
      const userData = {
        firstName: "Abhishek",
        lastName: "Gupta",
        email: "abhishek@codersgyan.com",
        password: "password",
      };
      // Act
      await request(app).post("/auth/register").send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users[0]).toHaveProperty("role");
      expect(users[0].role).toBe(Roles.CUSTOMER);
    });

    it("should store the hashed password in the database", async () => {
      // Arrange
      const userData = {
        firstName: "Abhishek",
        lastName: "Gupta",
        email: "abhishek@codersgyan.com",
        password: "password",
      };
      // Act
      await request(app).post("/auth/register").send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users[0].password).not.toBe(userData.password);
      expect(users[0].password).toHaveLength(60);
      expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
    });

    it("should return 400 status code if email is already exists", async () => {
      // Arrange
      const userData = {
        firstName: "Abhishek",
        lastName: "Gupta",
        email: "abhishek@codersgyan.com",
        password: "password",
      };
      const userRepository = connection.getRepository(User);
      await userRepository.save({ ...userData, role: Roles.CUSTOMER });

      // Act
      const response = await request(app).post("/auth/register").send(userData);

      const users = await userRepository.find();
      // Assert
      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(1);
    });

    it("should return the accessToken and refreshToken inside a cookie", async () => {
      // Arrange
      const userData = {
        firstName: "Abhishek",
        lastName: "Gupta",
        email: "abhishek@codersgyan.com",
        password: "password",
      };

      // Act
      const response = await request(app).post("/auth/register").send(userData);

      interface Headers {
        "set-cookie": string[];
      }

      // Assert
      let accessToken = null;
      let refreshToken = null;

      const cookies = (response.headers as Headers)["set-cookie"] || [];

      cookies.forEach((cookie) => {
        if (cookie.startsWith("accessToken=")) {
          accessToken = cookie.split(";")[0].split("=")[1];
        }

        if (cookie.startsWith("refreshToken=")) {
          refreshToken = cookie.split(";")[0].split("=")[1];
        }
      });

      expect(accessToken).not.toBeNull();
      expect(refreshToken).not.toBeNull();

      expect(isJwt(accessToken)).toBeTruthy();
      expect(isJwt(refreshToken)).toBeTruthy();
    });
  });
  describe("Fields are missing", () => {
    it("should return 400 status code if email field is missing", async () => {
      // Arrange
      const userData = {
        firstName: "Abhishek",
        lastName: "Gupta",
        email: "",
        password: "password",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);
      // console.log("response", response.error);

      // Assert
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });

    it("should return 400 status code if firstName is missing", async () => {
      // Arrange
      const userData = {
        firstName: "",
        lastName: "Gupta",
        email: "abhishek@codersgyan.com",
        password: "password",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);
      // console.log("response", response.error);

      // Assert
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });

    it("should return 400 status code if lastName is missing", async () => {
      // Arrange
      const userData = {
        firstName: "Abhishek",
        lastName: "",
        email: "abhishek@codersgyan.com",
        password: "password",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);
      // console.log("response", response.error);

      // Assert
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });

    it("should return 400 status code if password is missing", async () => {
      // Arrange
      const userData = {
        firstName: "Abhishek",
        lastName: "Gupta",
        email: "abhishek@codersgyan.com",
        password: "",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);
      // console.log("response", response.error);

      // Assert
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });
  });

  describe("Fields are not in proper format", () => {
    it("should trim the email field", async () => {
      // Arrange
      const userData = {
        firstName: "Abhishek",
        lastName: "Gupta",
        email: " abhishek@codersgyan.com ",
        password: "password",
      };
      // Act
      await request(app).post("/auth/register").send(userData);

      // Assert 1
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      const user = users[0];
      expect(user.email).toBe("abhishek@codersgyan.com");
    });

    it("should return 400 status code if email is not a valid email", async () => {
      // Arrange
      const userData = {
        firstName: "Abhishek",
        lastName: "Gupta",
        email: "codersgyan",
        password: "password",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert 1
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });

    it("should return 400 status code if password length is less than 8 character", async () => {
      // Arrange
      const userData = {
        firstName: "Abhishek",
        lastName: "Gupta",
        email: " abhishek@codersgyan.com ",
        password: "pass",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert 1
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });

    it("shoud return an array of error messages if email is missing", async () => {
      // Arrange
      const userData = {
        firstName: "Abhishek",
        lastName: "Gupta",
        email: "",
        password: "password", // less than 8 chars
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      expect(response.body).toHaveProperty("errors");
      expect(
        (response.body as Record<string, string>).errors.length,
      ).toBeGreaterThan(0);
    });

    it("shoud return an array of error messages if firstName is missing", async () => {
      // Arrange
      const userData = {
        firstName: "",
        lastName: "Gupta",
        email: "abhishek@codersgyan.com",
        password: "password", // less than 8 chars
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      expect(response.body).toHaveProperty("errors");
      expect(
        (response.body as Record<string, string>).errors.length,
      ).toBeGreaterThan(0);
    });
  });
});
