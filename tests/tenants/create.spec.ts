import request from "supertest";
import { DataSource } from "typeorm";
import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";
import { Tenant } from "../../src/entity/Tenant";
import createJWKSMock from "mock-jwks";
import { Roles } from "../../src/constants";

describe("POST /tenants", () => {
  let connection: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;
  let adminToken: string;

  beforeAll(async () => {
    jwks = createJWKSMock("http://localhost:5501");
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    jwks.start();
    adminToken = jwks.token({ sub: "1", role: Roles.ADMIN });
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
    it("should return a 201 status code", async () => {
      // Arrange
      const tenantData = {
        name: "Tenant Name",
        address: "Main St.",
      };
      // Act

      const response = await request(app)
        .post("/tenants")
        .set("Cookie", `accessToken=${adminToken}`)
        .send(tenantData);

      // Assert
      expect(response.statusCode).toBe(201);
    });

    it("should create a tenant in the database", async () => {
      // Arrange
      const tenantData = {
        name: "Tenant Name",
        address: "Main St.",
      };

      // Act
      await request(app)
        .post("/tenants")
        .set("Cookie", `accessToken=${adminToken}`)
        .send(tenantData);

      // Assert
      const tenantRepository = connection.getRepository(Tenant);
      const tenants = await tenantRepository.find();

      expect(tenants).toHaveLength(1);
      expect(tenants[0].name).toBe(tenantData.name);
      expect(tenants[0].address).toBe(tenantData.address);
    });

    it("should return 401 if user is not authenticated", async () => {
      // Arrange
      const tenantData = {
        name: "Tenant Name",
        address: "Main St.",
      };

      // Act
      const response = await request(app).post("/tenants").send(tenantData);

      // Assert
      const tenantRepository = connection.getRepository(Tenant);
      const tenants = await tenantRepository.find();

      expect(response.statusCode).toBe(401);
      expect(tenants).toHaveLength(0);
    });

    it("should return 403 if user is not an admin", async () => {
      // Arrange
      const managerToken = jwks.token({ sub: "1", role: Roles.MANAGER });

      const tenantData = {
        name: "Tenant Name",
        address: "Main St.",
      };

      // Act
      const response = await request(app)
        .post("/tenants")
        .set("Cookie", `accessToken=${managerToken}`)
        .send(tenantData);

      // Assert
      // const tenantRepository = connection.getRepository(Tenant);
      // const tenants = await tenantRepository.find();

      expect(response.statusCode).toBe(403);
    });
  });
});
