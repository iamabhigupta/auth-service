import request from "supertest";
import app from "../../src/app";

describe("POST /auth/register", () => {
  describe("Given all fiels", () => {
    it("should return the 201 status code", async () => {
      // Arrange
      const userData = {
        firstName: "Abhishek",
        lastName: "Gupta",
        email: "abhishek@gupta.com",
        password: "secret",
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
        email: "abhishek@gupta.com",
        password: "secret",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);
      // Assert
      expect(
        (response.headers as Record<string, string>)["content-type"],
      ).toEqual(expect.stringContaining("json"));
    });

    it("should persist user data in the database", async () => {
      // Arrange
      const userData = {
        firstName: "Abhishek",
        lastName: "Gupta",
        email: "abhishek@gupta.com",
        password: "secret",
      };
      // Act
      await request(app).post("/auth/register").send(userData);
      // Assert
    });
  });
});
