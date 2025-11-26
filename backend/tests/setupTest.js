"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
globals_1.jest.mock("@prisma/client", () => {
    const mockPrismaClient = {
        theme: {
            findMany: globals_1.jest.fn(),
            create: globals_1.jest.fn(),
            update: globals_1.jest.fn(),
            delete: globals_1.jest.fn(),
        },
        hint: {
            findMany: globals_1.jest.fn(),
            findFirst: globals_1.jest.fn(),
            create: globals_1.jest.fn(),
            update: globals_1.jest.fn(),
            delete: globals_1.jest.fn(),
        },
        gameSession: {
            findUnique: globals_1.jest.fn(),
            findMany: globals_1.jest.fn(),
            create: globals_1.jest.fn(),
            update: globals_1.jest.fn(),
        },
        hintUsage: {
            findFirst: globals_1.jest.fn(),
            create: globals_1.jest.fn(),
        },
        $connect: globals_1.jest.fn(),
        $disconnect: globals_1.jest.fn(),
        _count: {
            select: { hints: true },
        },
    };
    return {
        PrismaClient: globals_1.jest.fn(() => mockPrismaClient),
    };
});
//# sourceMappingURL=setupTest.js.map