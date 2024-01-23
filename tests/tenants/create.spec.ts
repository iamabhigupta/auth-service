import request from "supertest";
import { DataSource } from "typeorm";
import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";

describe("POST /tenants", () => {
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
    it("should return a 201 status code", async () => {
      // Arrange
      const tenantData = {
        name: "Tenant Name",
        address: "Main St.",
      };

      // Act
      const response = await request(app).post("/tenants").send(tenantData);

      // Assert
      expect(response.statusCode).toBe(201);
    });
  });
});
