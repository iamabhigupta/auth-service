import request from "supertest";
import app from "../../src/app";

describe("POST /auth/register", () => {
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
   });
   describe("Fields are missing", () => {});
});
