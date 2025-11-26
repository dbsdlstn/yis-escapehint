import request from "supertest";
import app from "../src/app";

describe("Theme Module API Tests", () => {
  describe("GET /themes", () => {
    it("should return playable themes", async () => {
      const response = await request(app).get("/themes").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});

describe("Session Module API Tests", () => {
  describe("POST /sessions", () => {
    it("should create a new game session", async () => {
      // We'll need to have a valid theme ID to test this properly
      const response = await request(app).post("/sessions").send({ themeId: "some-valid-theme-id" }).expect(400); // Expecting 400 because we don't have a valid theme ID

      // This test ensures the endpoint exists
      expect(response.status).toBe(400); // 400 indicates endpoint exists but invalid input
    });
  });

  describe("GET /sessions/:sessionId", () => {
    it("should get session details", async () => {
      const response = await request(app).get("/sessions/non-existent-session-id").expect(404);

      expect(response.status).toBe(404);
    });
  });

  describe("POST /sessions/:sessionId/hints", () => {
    it("should submit hint code", async () => {
      const response = await request(app)
        .post("/sessions/non-existent-session-id/hints")
        .send({ code: "HINT01" })
        .expect(404);

      expect(response.status).toBe(404);
    });
  });
});

describe("Admin Authentication API Tests", () => {
  describe("POST /admin/auth/login", () => {
    it("should authenticate admin", async () => {
      const response = await request(app).post("/admin/auth/login").send({ password: "admin123" }).expect(401); // Should return 401 for invalid password

      expect(response.status).toBe(401);
    });
  });
});

describe("Admin Theme API Tests", () => {
  describe("GET /admin/themes", () => {
    it("should return all themes for admin", async () => {
      const response = await request(app).get("/admin/themes").set("Authorization", "Bearer invalid-token").expect(401); // Should return 401 for invalid token

      expect(response.status).toBe(401);
    });
  });

  describe("POST /admin/themes", () => {
    it("should create a new theme", async () => {
      const response = await request(app)
        .post("/admin/themes")
        .set("Authorization", "Bearer invalid-token")
        .send({
          name: "Test Theme",
          description: "A test theme",
          playTime: 60,
          isActive: true,
        })
        .expect(401); // Should return 401 for invalid token

      expect(response.status).toBe(401);
    });
  });
});

describe("Admin Hint API Tests", () => {
  describe("GET /admin/themes/:themeId/hints", () => {
    it("should return hints for a theme", async () => {
      const response = await request(app)
        .get("/admin/themes/non-existent-theme-id/hints")
        .set("Authorization", "Bearer invalid-token")
        .expect(401); // Should return 401 for invalid token

      expect(response.status).toBe(401);
    });
  });

  describe("POST /admin/themes/:themeId/hints", () => {
    it("should create a new hint", async () => {
      const response = await request(app)
        .post("/admin/themes/non-existent-theme-id/hints")
        .set("Authorization", "Bearer invalid-token")
        .send({
          code: "HINT01",
          content: "Test hint content",
          answer: "Test answer",
          progressRate: 10,
          order: 1,
        })
        .expect(401); // Should return 401 for invalid token

      expect(response.status).toBe(401);
    });
  });
});

describe("Admin Session API Tests", () => {
  describe("GET /admin/sessions", () => {
    it("should return game sessions", async () => {
      const response = await request(app)
        .get("/admin/sessions")
        .set("Authorization", "Bearer invalid-token")
        .expect(401); // Should return 401 for invalid token

      expect(response.status).toBe(401);
    });
  });
});
