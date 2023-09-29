import request from "supertest";

import app from "../../src/app";

describe("POST /auth/register", () => {
   describe("Given all fields", () => {
      it("should return 201 status code", async () => {
         //Arrange
         const userData = {
            firstName: "Abhishek",
            lastName: "Gupta",
            email: "abhishek@codersgyan.com",
            password: "Secret",
         };
         //Act
         const response = await request(app)
            .post("/auth/register")
            .send(userData);
         //Assert
         expect(response.statusCode).toBe(201);
      });

      it("should return json in response", async () => {
         //Arrange
         const userData = {
            firstName: "Abhishek",
            lastName: "Gupta",
            email: "abhishek@codersgyan.com",
            password: "Secret",
         };
         //Act
         const response = await request(app)
            .post("/auth/register")
            .send(userData);
         //Assert
         expect(
            (response.headers as Record<string, string>)["content-type"],
         ).toEqual(expect.stringContaining("json"));
      });
   });

   describe("POST /auth/register", () => {
      it("", () => {});
   });
});
