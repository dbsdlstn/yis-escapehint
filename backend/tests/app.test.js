"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
describe("App Setup Tests", () => {
    describe("GET /", () => {
        it("should return welcome message", async () => {
            const response = await (0, supertest_1.default)(app_1.default).get("/").expect(200);
            expect(response.body).toEqual({
                message: "EscapeHint API 서버에 오신 것을 환영합니다!",
            });
        });
    });
    describe("GET /api/health", () => {
        it("should return health status", async () => {
            const response = await (0, supertest_1.default)(app_1.default).get("/api/health").expect(200);
            expect(response.body).toHaveProperty("status", "OK");
            expect(response.body).toHaveProperty("timestamp");
            expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
        });
    });
    describe("Non-existent route", () => {
        it("should return 404 for non-existent route", async () => {
            const response = await (0, supertest_1.default)(app_1.default).get("/non-existent-route").expect(404);
            expect(response.text).toContain("Cannot GET /non-existent-route");
        });
    });
});
//# sourceMappingURL=app.test.js.map