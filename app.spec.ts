import request from "supertest";

import { add } from "./src/utils";
import app from "./src/app";

describe.skip("App", () => {
   it("should work", () => {
      const result = add(7, 27);
      expect(result).toBe(34);
   });
   it("should return 200 status", async () => {
      const response = await request(app).get("/").send();
      expect(response.statusCode).toBe(200);
   });
});
