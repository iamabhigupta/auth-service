import request from "supertest";
import { DataSource } from "typeorm";
import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";
import createJWKSMock from "mock-jwks";

describe("POST /users", () => {
  let connection: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;

  beforeAll(async () => {
    jwks = createJWKSMock("http://localhost:5501");
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    jwks.start();
    // Database truncate
    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterEach(() => {
    jwks.stop();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("Given all fields", () => {
    it("should persist the user in the database", async () => {
      // Register user
      const adminToken = jwks.token({ sub: "1", role: Roles.ADMIN });
      const userData = {
        firstName: "Abhishek",
        lastName: "Gupta",
        email: "abhishek@codersgyan.com",
        password: "password",
        tenantID: 1,
      };

      // Act
      await request(app)
        .post("/users")
        .set("Cookie", `accessToken=${adminToken}`)
        .send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users).toHaveLength(1);
      expect(users[0].email).toBe(userData.email);
    });

    it("should create a manager user", async () => {
      // Register user
      const adminToken = jwks.token({ sub: "1", role: Roles.ADMIN });
      const userData = {
        firstName: "Abhishek",
        lastName: "Gupta",
        email: "abhishek@codersgyan.com",
        password: "password",
        tenantID: 1,
      };

      // Act
      await request(app)
        .post("/users")
        .set("Cookie", `accessToken=${adminToken}`)
        .send(userData);

      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users).toHaveLength(1);
      expect(users[0].role).toBe(Roles.MANAGER);
    });

    // it.todo("should return 403 if non admin user tries to create a user");
  });
});
