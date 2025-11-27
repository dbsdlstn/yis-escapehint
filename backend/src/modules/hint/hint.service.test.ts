import { HintService } from "./hint.service";
import { ConflictError } from "../../shared/errors/AppError";

// Mock Prisma
jest.mock("@prisma/client", () => {
  const mockPrisma = {
    hint: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

// Now import PrismaClient after the mock
const { PrismaClient } = require("@prisma/client");

describe("HintService", () => {
  let hintService: HintService;
  let mockPrisma: any;

  beforeEach(() => {
    hintService = new HintService();
    mockPrisma = (hintService as any).prisma;
    jest.clearAllMocks();
  });

  describe("createHint", () => {
    it("should successfully create a hint if code is unique within theme (BR-01)", async () => {
      const hintData = {
        themeId: "theme1",
        code: "HINT01",
        content: "This is a hint",
        answer: "Answer",
        progressRate: 10,
        isActive: true,
      };

      (mockPrisma.hint.findFirst as jest.Mock).mockResolvedValue(null);
      (mockPrisma.hint.create as jest.Mock).mockResolvedValue({
        id: "hint1",
        ...hintData,
      });

      const result = await hintService.createHint(hintData);

      expect(mockPrisma.hint.findFirst).toHaveBeenCalledWith({
        where: {
          themeId: "theme1",
          code: "HINT01",
        },
      });
      expect(mockPrisma.hint.create).toHaveBeenCalledWith({
        data: {
          ...hintData,
          code: "HINT01",
          order: 0,
        },
      });
      expect(result).toEqual({
        id: "hint1",
        ...hintData,
      });
    });

    it("should throw ConflictError if hint code already exists in the same theme (BR-01)", async () => {
      const hintData = {
        themeId: "theme1",
        code: "HINT01",
        content: "This is a hint",
        answer: "Answer",
        progressRate: 10,
        isActive: true,
      };

      (mockPrisma.hint.findFirst as jest.Mock).mockResolvedValue({
        id: "existingHint",
        themeId: "theme1",
        code: "HINT01",
      });

      await expect(hintService.createHint(hintData)).rejects.toThrow(ConflictError);
      expect(mockPrisma.hint.create).not.toHaveBeenCalled();
    });
  });

  describe("updateHint", () => {
    it("should successfully update a hint if new code is unique within theme", async () => {
      const hintId = "hint1";
      const updateData = {
        code: "NEW_CODE",
        content: "Updated content",
      };

      (mockPrisma.hint.findUnique as jest.Mock).mockResolvedValue({
        id: hintId,
        themeId: "theme1",
        code: "OLD_CODE",
      });
      (mockPrisma.hint.findFirst as jest.Mock).mockResolvedValue(null);
      (mockPrisma.hint.update as jest.Mock).mockResolvedValue({
        id: hintId,
        ...updateData,
      });

      const result = await hintService.updateHint(hintId, updateData);

      expect(mockPrisma.hint.findUnique).toHaveBeenCalledWith({
        where: { id: hintId },
      });
      expect(mockPrisma.hint.findFirst).toHaveBeenCalledWith({
        where: {
          themeId: "theme1",
          code: "NEW_CODE",
          NOT: { id: hintId },
        },
      });
      expect(mockPrisma.hint.update).toHaveBeenCalledWith({
        where: { id: hintId },
        data: {
          code: "NEW_CODE",
          content: "Updated content",
        },
      });
      expect(result).toEqual({
        id: hintId,
        ...updateData,
      });
    });

    it("should throw ConflictError if new code already exists for the same theme", async () => {
      const hintId = "hint1";
      const updateData = {
        code: "EXISTING_CODE",
        content: "Updated content",
      };

      (mockPrisma.hint.findUnique as jest.Mock).mockResolvedValue({
        id: hintId,
        themeId: "theme1",
        code: "OLD_CODE",
      });
      (mockPrisma.hint.findFirst as jest.Mock).mockResolvedValue({
        id: "otherHint",
        themeId: "theme1",
        code: "EXISTING_CODE",
      });

      await expect(hintService.updateHint(hintId, updateData)).rejects.toThrow(ConflictError);
      expect(mockPrisma.hint.update).not.toHaveBeenCalled();
    });

    it("should not check for conflicts when code is not being updated", async () => {
      const hintId = "hint1";
      const updateData = {
        content: "Updated content",
      };

      (mockPrisma.hint.findUnique as jest.Mock).mockResolvedValue({
        id: hintId,
        themeId: "theme1",
        code: "SAME_CODE",
      });
      (mockPrisma.hint.update as jest.Mock).mockResolvedValue({
        id: hintId,
        ...updateData,
        code: "SAME_CODE",
      });

      const result = await hintService.updateHint(hintId, updateData);

      expect(mockPrisma.hint.findFirst).not.toHaveBeenCalled();
      expect(mockPrisma.hint.update).toHaveBeenCalledWith({
        where: { id: hintId },
        data: {
          content: "Updated content",
        },
      });
      expect(result).toEqual({
        id: hintId,
        ...updateData,
        code: "SAME_CODE",
      });
    });
  });
});
