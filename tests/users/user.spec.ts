import request from "supertest";
import { DataSource } from "typeorm";
import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";
import createJWKSMock from "mock-jwks";

describe("GET /auth/self", () => {
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
    it("should return return 200 status code", async () => {
      // Arrange
      // Act
      const accessToken = jwks.token({ sub: "1", role: Roles.CUSTOMER });
      const response = await request(app)
        .get("/auth/self")
        .set("Cookie", `accessToken=${accessToken}`)
        .send();
      // Assert
      expect(response.statusCode).toBe(200);
    });

    it("should return the user data", async () => {
      // Register user
      const userData = {
        firstName: "Abhishek",
        lastName: "Gupta",
        email: "abhishek@codersgyan.com",
        password: "password",
      };

      const userRepository = connection.getRepository(User);
      const data = await userRepository.save({
        ...userData,
        role: Roles.CUSTOMER,
      });

      // Generate token
      const accessToken = jwks.token({ sub: String(data.id), role: data.role });

      // Act
      const response = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken};`])
        .send();
      // Assert
      // check if user id matches with registed user
      expect((response.body as Record<string, string>).id).toBe(data.id);
    });

    it("should not return the user password", async () => {
      // Register user
      const userData = {
        firstName: "Abhishek",
        lastName: "Gupta",
        email: "abhishek@codersgyan.com",
        password: "password",
      };

      const userRepository = connection.getRepository(User);
      const data = await userRepository.save({
        ...userData,
        role: Roles.CUSTOMER,
      });

      // Generate token
      const accessToken = jwks.token({ sub: String(data.id), role: data.role });

      // Act
      const response = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken};`])
        .send();
      // Assert
      // check if user id matches with registed user
      expect(response.body).not.toHaveProperty("password");
    });
  });
});
