import { SessionService } from './session.service';
import {
  HintNotFoundError,
  SessionNotFoundError,
  HintInactiveError,
  HintThemeMismatchError
} from '../../shared/errors/AppError';

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    gameSession: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    hint: {
      findFirst: jest.fn(),
    },
    hintUsage: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
    theme: {
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const { PrismaClient } = require('@prisma/client');

describe('SessionService', () => {
  let sessionService: SessionService;
  let mockPrisma: any;

  beforeEach(() => {
    sessionService = new SessionService();
    mockPrisma = (sessionService as any).prisma;
    jest.clearAllMocks();
  });

  describe('submitHint', () => {
    it('should successfully submit a valid hint and return hint details', async () => {
      const sessionId = 'session1';
      const code = 'HINT01';

      // Mock session
      (mockPrisma.gameSession.findUnique as jest.Mock).mockResolvedValue({
        id: sessionId,
        themeId: 'theme1',
      });

      // Mock hint
      (mockPrisma.hint.findFirst as jest.Mock).mockResolvedValue({
        id: 'hint1',
        themeId: 'theme1',
        code: 'HINT01',
        isActive: true,
      });

      // Mock hint usage (not found, meaning it's a new usage)
      (mockPrisma.hintUsage.findFirst as jest.Mock).mockResolvedValue(null);

      // Mock hint usage creation
      (mockPrisma.hintUsage.create as jest.Mock).mockResolvedValue({});

      // Mock session update
      (mockPrisma.gameSession.update as jest.Mock).mockResolvedValue({});

      // Mock hint usages for progress calculation
      (mockPrisma.hintUsage.findMany as jest.Mock).mockResolvedValue([
        { hint: { progressRate: 20 } }
      ]);

      const result = await sessionService.submitHint(sessionId, code);

      expect(result).toHaveProperty('hint');
      expect(result).toHaveProperty('progressRate');
      expect(result).toHaveProperty('alreadyUsed');
    });

    it('should throw SessionNotFoundError if session does not exist (BR-06)', async () => {
      (mockPrisma.gameSession.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(sessionService.submitHint('invalidSession', 'HINT01'))
        .rejects.toThrow(SessionNotFoundError);
    });

    it('should throw HintNotFoundError if hint does not exist (BR-06)', async () => {
      const sessionId = 'session1';

      // Mock session exists
      (mockPrisma.gameSession.findUnique as jest.Mock).mockResolvedValue({
        id: sessionId,
        themeId: 'theme1',
      });

      // Mock hint does not exist
      (mockPrisma.hint.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(sessionService.submitHint(sessionId, 'NONEXISTENT'))
        .rejects.toThrow(HintNotFoundError);
    });

    it('should throw HintThemeMismatchError if hint exists but is for a different theme (BR-06)', async () => {
      const sessionId = 'session1';
      const code = 'HINT01';

      // Mock session
      (mockPrisma.gameSession.findUnique as jest.Mock).mockResolvedValue({
        id: sessionId,
        themeId: 'theme1', // Different theme
      });

      // Mock hint exists but in a different theme
      (mockPrisma.hint.findFirst as jest.Mock).mockResolvedValue({
        id: 'hint1',
        themeId: 'theme2', // Different theme
        code: 'HINT01',
        isActive: true,
      });

      await expect(sessionService.submitHint(sessionId, code))
        .rejects.toThrow(HintThemeMismatchError);
    });

    it('should throw HintInactiveError if hint exists but is inactive (BR-06)', async () => {
      const sessionId = 'session1';
      const code = 'HINT01';

      // Mock session
      (mockPrisma.gameSession.findUnique as jest.Mock).mockResolvedValue({
        id: sessionId,
        themeId: 'theme1',
      });

      // Mock hint exists but is inactive
      (mockPrisma.hint.findFirst as jest.Mock).mockResolvedValue({
        id: 'hint1',
        themeId: 'theme1',
        code: 'HINT01',
        isActive: false, // Inactive
      });

      await expect(sessionService.submitHint(sessionId, code))
        .rejects.toThrow(HintInactiveError);
    });
  });
});