"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
describe("Integration Tests for API Endpoints", () => {
    beforeEach(async () => {
        await prisma.hintUsage.deleteMany({});
        await prisma.gameSession.deleteMany({});
        await prisma.hint.deleteMany({});
        await prisma.theme.deleteMany({});
    });
    describe("Player Theme API Tests", () => {
        describe("GET /themes", () => {
            it("should return playable themes", async () => {
                await prisma.theme.create({
                    data: {
                        name: "Test Theme",
                        description: "A test theme",
                        playTime: 60,
                        isActive: true,
                    },
                });
                const response = await (0, supertest_1.default)(app_1.default).get("/themes").expect(200);
                expect(Array.isArray(response.body)).toBe(true);
                expect(response.body.length).toBeGreaterThan(0);
                expect(response.body[0]).toHaveProperty('name', 'Test Theme');
                expect(response.body[0]).toHaveProperty('hintCount');
            });
            it("should only return active themes by default", async () => {
                await prisma.theme.create({
                    data: {
                        name: "Inactive Theme",
                        playTime: 60,
                        isActive: false,
                    },
                });
                const response = await (0, supertest_1.default)(app_1.default).get("/themes").expect(200);
                const inactiveTheme = response.body.find((theme) => theme.name === "Inactive Theme");
                expect(inactiveTheme).toBeUndefined();
            });
            it("should handle empty theme list", async () => {
                await prisma.theme.deleteMany({});
                const response = await (0, supertest_1.default)(app_1.default).get("/themes").expect(200);
                expect(response.body).toEqual([]);
            });
        });
    });
    describe("Player Session API Tests", () => {
        let testTheme;
        beforeEach(async () => {
            testTheme = await prisma.theme.create({
                data: {
                    name: "Session Test Theme",
                    description: "A theme for session tests",
                    playTime: 60,
                    isActive: true,
                },
            });
        });
        describe("POST /sessions", () => {
            it("should create a new game session", async () => {
                const response = await (0, supertest_1.default)(app_1.default)
                    .post("/sessions")
                    .send({ themeId: testTheme.id })
                    .expect(201);
                expect(response.body).toHaveProperty('id');
                expect(response.body).toHaveProperty('themeId', testTheme.id);
                expect(response.body).toHaveProperty('status', 'in_progress');
                expect(response.body).toHaveProperty('usedHintCount', 0);
            });
            it("should return 404 for non-existent theme", async () => {
                const response = await (0, supertest_1.default)(app_1.default)
                    .post("/sessions")
                    .send({ themeId: "non-existent-id" })
                    .expect(404);
                expect(response.body).toHaveProperty('message');
            });
            it("should validate request body", async () => {
                const response = await (0, supertest_1.default)(app_1.default)
                    .post("/sessions")
                    .send({})
                    .expect(500);
                expect(response.body).toHaveProperty('message');
            });
        });
        describe("GET /sessions/:sessionId", () => {
            it("should return session details", async () => {
                const session = await prisma.gameSession.create({
                    data: {
                        themeId: testTheme.id,
                        startTime: new Date(),
                        status: 'in_progress',
                    },
                });
                const response = await (0, supertest_1.default)(app_1.default)
                    .get(`/sessions/${session.id}`)
                    .expect(200);
                expect(response.body).toHaveProperty('id', session.id);
                expect(response.body).toHaveProperty('themeId', testTheme.id);
                expect(response.body).toHaveProperty('status', 'in_progress');
            });
            it("should return 404 for non-existent session", async () => {
                const response = await (0, supertest_1.default)(app_1.default)
                    .get("/sessions/non-existent-session-id")
                    .expect(404);
                expect(response.body).toHaveProperty('message');
            });
        });
        describe("POST /sessions/:sessionId/hints", () => {
            let session;
            let hint;
            beforeEach(async () => {
                session = await prisma.gameSession.create({
                    data: {
                        themeId: testTheme.id,
                        startTime: new Date(),
                        status: 'in_progress',
                    },
                });
                hint = await prisma.hint.create({
                    data: {
                        themeId: testTheme.id,
                        code: "TESTHINT",
                        content: "Test hint content",
                        answer: "Test answer",
                        progressRate: 20,
                        isActive: true,
                    },
                });
            });
            it("should submit a valid hint code and return hint details", async () => {
                const response = await (0, supertest_1.default)(app_1.default)
                    .post(`/sessions/${session.id}/hints`)
                    .send({ code: "TESTHINT" })
                    .expect(200);
                expect(response.body).toHaveProperty('id', hint.id);
                expect(response.body).toHaveProperty('content', hint.content);
                expect(response.body).toHaveProperty('answer');
            });
            it("should return 404 for non-existent hint code", async () => {
                const response = await (0, supertest_1.default)(app_1.default)
                    .post(`/sessions/${session.id}/hints`)
                    .send({ code: "NONEXISTENT" })
                    .expect(404);
                expect(response.body).toHaveProperty('message');
            });
            it("should return 400 for hint with wrong theme", async () => {
                const otherTheme = await prisma.theme.create({
                    data: {
                        name: "Other Theme",
                        playTime: 60,
                        isActive: true,
                    },
                });
                const otherHint = await prisma.hint.create({
                    data: {
                        themeId: otherTheme.id,
                        code: "OTHERHINT",
                        content: "Other hint content",
                        answer: "Other answer",
                        progressRate: 20,
                        isActive: true,
                    },
                });
                const response = await (0, supertest_1.default)(app_1.default)
                    .post(`/sessions/${session.id}/hints`)
                    .send({ code: "OTHERHINT" })
                    .expect(400);
                expect(response.body).toHaveProperty('message');
            });
            it("should return 400 for inactive hint", async () => {
                const inactiveHint = await prisma.hint.create({
                    data: {
                        themeId: testTheme.id,
                        code: "INACTIVEHINT",
                        content: "Inactive hint content",
                        answer: "Inactive answer",
                        progressRate: 10,
                        isActive: false,
                    },
                });
                const response = await (0, supertest_1.default)(app_1.default)
                    .post(`/sessions/${session.id}/hints`)
                    .send({ code: "INACTIVEHINT" })
                    .expect(400);
                expect(response.body).toHaveProperty('message');
            });
        });
    });
    describe("Admin Authentication API Tests", () => {
        describe("POST /admin/auth/login", () => {
            it("should authenticate admin with correct password", async () => {
                const response = await (0, supertest_1.default)(app_1.default)
                    .post("/admin/auth/login")
                    .send({ password: process.env.ADMIN_PASSWORD || "admin123" })
                    .expect(200);
                expect(response.body).toHaveProperty('accessToken');
                expect(typeof response.body.accessToken).toBe('string');
            });
            it("should reject admin with incorrect password", async () => {
                const response = await (0, supertest_1.default)(app_1.default)
                    .post("/admin/auth/login")
                    .send({ password: "wrongpassword" })
                    .expect(401);
                expect(response.body).toHaveProperty('message');
            });
            it("should validate request body", async () => {
                const response = await (0, supertest_1.default)(app_1.default)
                    .post("/admin/auth/login")
                    .send({})
                    .expect(400);
                expect(response.body).toHaveProperty('message');
            });
        });
    });
    describe("Admin Theme API Tests", () => {
        let adminToken;
        beforeAll(async () => {
            const loginResponse = await (0, supertest_1.default)(app_1.default)
                .post("/admin/auth/login")
                .send({ password: process.env.ADMIN_PASSWORD || "admin123" });
            adminToken = loginResponse.body.accessToken;
        });
        describe("GET /admin/themes", () => {
            it("should return all themes for admin", async () => {
                await prisma.theme.create({
                    data: {
                        name: "Admin Test Theme 1",
                        playTime: 60,
                        isActive: true,
                    },
                });
                await prisma.theme.create({
                    data: {
                        name: "Admin Test Theme 2",
                        playTime: 90,
                        isActive: false,
                    },
                });
                const response = await (0, supertest_1.default)(app_1.default)
                    .get("/admin/themes")
                    .set("Authorization", `Bearer ${adminToken}`)
                    .expect(200);
                expect(Array.isArray(response.body)).toBe(true);
                expect(response.body.length).toBe(2);
                expect(response.body.some((theme) => theme.name === "Admin Test Theme 1")).toBe(true);
                expect(response.body.some((theme) => theme.name === "Admin Test Theme 2")).toBe(true);
            });
            it("should require authentication", async () => {
                const response = await (0, supertest_1.default)(app_1.default)
                    .get("/admin/themes")
                    .set("Authorization", "Bearer invalid-token")
                    .expect(401);
                expect(response.body).toHaveProperty('message');
            });
        });
        describe("POST /admin/themes", () => {
            it("should create a new theme", async () => {
                const newTheme = {
                    name: "New Test Theme",
                    description: "A new theme for testing",
                    playTime: 75,
                    isActive: true,
                };
                const response = await (0, supertest_1.default)(app_1.default)
                    .post("/admin/themes")
                    .set("Authorization", `Bearer ${adminToken}`)
                    .send(newTheme)
                    .expect(201);
                expect(response.body).toHaveProperty('id');
                expect(response.body).toHaveProperty('name', newTheme.name);
                expect(response.body).toHaveProperty('description', newTheme.description);
                expect(response.body).toHaveProperty('playTime', newTheme.playTime);
                expect(response.body).toHaveProperty('isActive', newTheme.isActive);
            });
            it("should validate theme data", async () => {
                const invalidTheme = {
                    name: "",
                    playTime: 5,
                };
                const response = await (0, supertest_1.default)(app_1.default)
                    .post("/admin/themes")
                    .set("Authorization", `Bearer ${adminToken}`)
                    .send(invalidTheme)
                    .expect(500);
                expect(response.body).toHaveProperty('message');
            });
            it("should require authentication", async () => {
                const response = await (0, supertest_1.default)(app_1.default)
                    .post("/admin/themes")
                    .send({
                    name: "Unauthorized Theme",
                    playTime: 60,
                })
                    .expect(401);
                expect(response.body).toHaveProperty('message');
            });
        });
    });
    describe("Admin Hint API Tests", () => {
        let adminToken;
        let testTheme;
        beforeAll(async () => {
            const loginResponse = await (0, supertest_1.default)(app_1.default)
                .post("/admin/auth/login")
                .send({ password: process.env.ADMIN_PASSWORD || "admin123" });
            adminToken = loginResponse.body.accessToken;
            testTheme = await prisma.theme.create({
                data: {
                    name: "Hint Test Theme",
                    playTime: 60,
                    isActive: true,
                },
            });
        });
        describe("GET /admin/themes/:themeId/hints", () => {
            beforeEach(async () => {
                await prisma.hint.createMany({
                    data: [
                        {
                            themeId: testTheme.id,
                            code: "HINT01",
                            content: "First hint",
                            answer: "First answer",
                            progressRate: 10,
                            isActive: true,
                            order: 1,
                        },
                        {
                            themeId: testTheme.id,
                            code: "HINT02",
                            content: "Second hint",
                            answer: "Second answer",
                            progressRate: 20,
                            isActive: true,
                            order: 2,
                        },
                    ],
                });
            });
            it("should return hints for a specific theme", async () => {
                const response = await (0, supertest_1.default)(app_1.default)
                    .get(`/admin/themes/${testTheme.id}/hints`)
                    .set("Authorization", `Bearer ${adminToken}`)
                    .expect(200);
                expect(Array.isArray(response.body)).toBe(true);
                expect(response.body.length).toBe(2);
                expect(response.body[0]).toHaveProperty('code', 'HINT01');
                expect(response.body[0]).toHaveProperty('order', 1);
                expect(response.body[1]).toHaveProperty('code', 'HINT02');
                expect(response.body[1]).toHaveProperty('order', 2);
            });
            it("should require authentication", async () => {
                const response = await (0, supertest_1.default)(app_1.default)
                    .get(`/admin/themes/${testTheme.id}/hints`)
                    .set("Authorization", "Bearer invalid-token")
                    .expect(401);
                expect(response.body).toHaveProperty('message');
            });
        });
        describe("POST /admin/themes/:themeId/hints", () => {
            it("should create a new hint for a theme", async () => {
                const newHint = {
                    code: "NEWHINT",
                    content: "New hint content",
                    answer: "New hint answer",
                    progressRate: 25,
                    order: 3,
                    isActive: true,
                };
                const response = await (0, supertest_1.default)(app_1.default)
                    .post(`/admin/themes/${testTheme.id}/hints`)
                    .set("Authorization", `Bearer ${adminToken}`)
                    .send(newHint)
                    .expect(201);
                expect(response.body).toHaveProperty('id');
                expect(response.body).toHaveProperty('code', newHint.code.toUpperCase());
                expect(response.body).toHaveProperty('content', newHint.content);
                expect(response.body).toHaveProperty('answer', newHint.answer);
                expect(response.body).toHaveProperty('progressRate', newHint.progressRate);
                expect(response.body).toHaveProperty('order', newHint.order);
                expect(response.body).toHaveProperty('isActive', newHint.isActive);
            });
            it("should validate hint data", async () => {
                const invalidHint = {
                    code: "",
                    content: "Content without code or answer",
                    answer: "Answer without code",
                    progressRate: -1,
                };
                const response = await (0, supertest_1.default)(app_1.default)
                    .post(`/admin/themes/${testTheme.id}/hints`)
                    .set("Authorization", `Bearer ${adminToken}`)
                    .send(invalidHint)
                    .expect(500);
                expect(response.body).toHaveProperty('message');
            });
            it("should enforce business rule BR-01: hint code uniqueness within theme", async () => {
                await (0, supertest_1.default)(app_1.default)
                    .post(`/admin/themes/${testTheme.id}/hints`)
                    .set("Authorization", `Bearer ${adminToken}`)
                    .send({
                    code: "UNIQUEHINT",
                    content: "Unique hint content",
                    answer: "Unique answer",
                    progressRate: 10,
                    isActive: true,
                })
                    .expect(201);
                const response = await (0, supertest_1.default)(app_1.default)
                    .post(`/admin/themes/${testTheme.id}/hints`)
                    .set("Authorization", `Bearer ${adminToken}`)
                    .send({
                    code: "UNIQUEHINT",
                    content: "Duplicate hint content",
                    answer: "Duplicate answer",
                    progressRate: 15,
                    isActive: true,
                })
                    .expect(409);
                expect(response.body).toHaveProperty('message');
            });
            it("should require authentication", async () => {
                const response = await (0, supertest_1.default)(app_1.default)
                    .post(`/admin/themes/${testTheme.id}/hints`)
                    .send({
                    code: "UNAUTHORIZEDHINT",
                    content: "Unauthorized hint",
                    answer: "Unauthorized answer",
                    progressRate: 10,
                })
                    .expect(401);
                expect(response.body).toHaveProperty('message');
            });
        });
    });
    describe("Admin Session API Tests", () => {
        let adminToken;
        let testTheme;
        let testSession;
        beforeAll(async () => {
            const loginResponse = await (0, supertest_1.default)(app_1.default)
                .post("/admin/auth/login")
                .send({ password: process.env.ADMIN_PASSWORD || "admin123" });
            adminToken = loginResponse.body.accessToken;
            testTheme = await prisma.theme.create({
                data: {
                    name: "Session Admin Test Theme",
                    playTime: 60,
                    isActive: true,
                },
            });
            testSession = await prisma.gameSession.create({
                data: {
                    themeId: testTheme.id,
                    startTime: new Date(),
                    status: 'in_progress',
                },
            });
        });
        describe("GET /admin/sessions", () => {
            it("should return game sessions for admin", async () => {
                const response = await (0, supertest_1.default)(app_1.default)
                    .get("/admin/sessions")
                    .set("Authorization", `Bearer ${adminToken}`)
                    .expect(200);
                expect(Array.isArray(response.body)).toBe(true);
                expect(response.body.length).toBeGreaterThanOrEqual(1);
                expect(response.body.some((session) => session.id === testSession.id)).toBe(true);
            });
            it("should filter sessions by status", async () => {
                await prisma.gameSession.create({
                    data: {
                        themeId: testTheme.id,
                        startTime: new Date(),
                        endTime: new Date(),
                        status: 'completed',
                    },
                });
                const response = await (0, supertest_1.default)(app_1.default)
                    .get("/admin/sessions?status=completed")
                    .set("Authorization", `Bearer ${adminToken}`)
                    .expect(200);
                expect(Array.isArray(response.body)).toBe(true);
                expect(response.body.every((session) => session.status === 'completed')).toBe(true);
            });
            it("should require authentication", async () => {
                const response = await (0, supertest_1.default)(app_1.default)
                    .get("/admin/sessions")
                    .set("Authorization", "Bearer invalid-token")
                    .expect(401);
                expect(response.body).toHaveProperty('message');
            });
        });
        describe("DELETE /admin/sessions/:sessionId", () => {
            it("should force-end a game session", async () => {
                const sessionToAbort = await prisma.gameSession.create({
                    data: {
                        themeId: testTheme.id,
                        startTime: new Date(),
                        status: 'in_progress',
                    },
                });
                const response = await (0, supertest_1.default)(app_1.default)
                    .delete(`/admin/sessions/${sessionToAbort.id}`)
                    .set("Authorization", `Bearer ${adminToken}`)
                    .expect(204);
                const updatedSession = await prisma.gameSession.findUnique({
                    where: { id: sessionToAbort.id },
                });
                expect(updatedSession?.status).toBe('aborted');
            });
            it("should require authentication", async () => {
                const response = await (0, supertest_1.default)(app_1.default)
                    .delete(`/admin/sessions/${testSession.id}`)
                    .set("Authorization", "Bearer invalid-token")
                    .expect(401);
                expect(response.body).toHaveProperty('message');
            });
        });
    });
});
//# sourceMappingURL=api.test.js.map