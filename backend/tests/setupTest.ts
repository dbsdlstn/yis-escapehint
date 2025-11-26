// setupTest.ts
import { jest } from "@jest/globals";

// Mock Prisma Client
jest.mock("@prisma/client", () => {
  const mockPrismaClient = {
    theme: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    hint: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    gameSession: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    hintUsage: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    _count: {
      select: { hints: true },
    },
  };

  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});
