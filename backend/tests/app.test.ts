import request from "supertest";
import app from "../src/app";

describe("App Setup Tests", () => {
  describe("GET /", () => {
    it("should return welcome message", async () => {
      const response = await request(app).get("/").expect(200);

      expect(response.body).toEqual({
        message: "EscapeHint API 서버에 오신 것을 환영합니다!",
      });
    });
  });

  describe("GET /api/health", () => {
    it("should return health status", async () => {
      const response = await request(app).get("/api/health").expect(200);

      expect(response.body).toHaveProperty("status", "OK");
      expect(response.body).toHaveProperty("timestamp");
      expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
    });
  });

  describe("Non-existent route", () => {
    it("should return 404 for non-existent route", async () => {
      const response = await request(app).get("/non-existent-route").expect(404);

      // Express default 404 message
      expect(response.text).toContain("Cannot GET /non-existent-route");
    });
  });
});
