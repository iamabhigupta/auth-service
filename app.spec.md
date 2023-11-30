import request from "supertest";
import app from "./src/app";

const sum = (a: number, b: number): number => {
return a + b;
};

describe("App", () => {
it("shoul sum numbers", () => {
expect(sum(1, 2)).toBe(3);
});

it("should return 200 status", async () => {
const res = await request(app).get("/").send();
expect(res.statusCode).toBe(200);
});
});
