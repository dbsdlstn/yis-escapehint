// src/modules/session/session.service.ts
import { prisma } from "../../shared/utils/prisma.util";
import {
  HintNotFoundError,
  SessionNotFoundError,
  HintInactiveError,
  HintThemeMismatchError,
  ThemeNotFoundError,
} from "../../shared/errors/AppError";

export class SessionService {
  private prisma = prisma;

  async createSession(themeId: string) {
    // Verify theme exists
    const theme = await this.prisma.theme.findUnique({
      where: { id: themeId },
    });

    if (!theme) {
      throw new ThemeNotFoundError(themeId);
    }

    return this.prisma.gameSession.create({
      data: {
        themeId,
        startTime: new Date(),
        status: "in_progress",
        usedHintCount: 0,
      },
    });
  }

  async getSession(id: string) {
    const session = await this.prisma.gameSession.findUnique({
      where: { id },
      include: {
        theme: true,
      },
    });

    if (!session) {
      throw new SessionNotFoundError(id);
    }

    return session;
  }

  async getSessions(filter?: { status?: string }) {
    const whereClause: any = filter?.status ? { status: filter.status } : {};
    return this.prisma.gameSession.findMany({
      where: whereClause,
      include: {
        theme: true,
      },
    });
  }

  async submitHint(sessionId: string, code: string) {
    // Use a transaction to ensure data consistency
    return this.prisma.$transaction(async tx => {
      // First get the session
      const session = await tx.gameSession.findUnique({
        where: { id: sessionId },
      });

      if (!session) {
        throw new SessionNotFoundError(sessionId);
      }

      // Find the hint by code - this should be optimized with proper indexing
      const hint = await tx.hint.findFirst({
        where: {
          code: code.toUpperCase(),
        },
      });

      // BR-06: Handle different types of hint code validation failures
      if (!hint) {
        throw new HintNotFoundError(code);
      }

      // Check if the hint is for the correct theme
      if (hint.themeId !== session.themeId) {
        throw new HintThemeMismatchError(code);
      }

      // Check if the hint is inactive
      if (!hint.isActive) {
        throw new HintInactiveError(code);
      }

      // Check if hint was already used in this session
      const existingUsage = await tx.hintUsage.findFirst({
        where: {
          sessionId,
          hintId: hint.id,
        },
      });

      if (!existingUsage) {
        // Record hint usage
        await tx.hintUsage.create({
          data: {
            sessionId,
            hintId: hint.id,
          },
        });

        // Increment hint count
        await tx.gameSession.update({
          where: { id: sessionId },
          data: { usedHintCount: { increment: 1 } },
        });
      }

      // Calculate progress rate based on the highest progress of all hints used
      // Only include hints for this specific session to avoid performance issues
      const hintUsages = await tx.hintUsage.findMany({
        where: { sessionId },
        include: { hint: true },
      });

      const maxProgressRate = Math.max(0, ...hintUsages.map(usage => usage.hint.progressRate));

      return {
        hint,
        progressRate: maxProgressRate,
        alreadyUsed: !!existingUsage,
      };
    });
  }

  async endSession(id: string) {
    const session = await this.prisma.gameSession.findUnique({
      where: { id },
    });

    if (!session) {
      throw new SessionNotFoundError(id);
    }

    await this.prisma.gameSession.update({
      where: { id },
      data: {
        status: "aborted",
        endTime: new Date(),
      },
    });
  }

  /**
   * 오늘 사용된 힌트 수를 가져옵니다.
   * @param startDate 오늘 자정
   * @param endDate 내일 자정
   * @returns 오늘 사용된 힌트 수
   */
  async getTodaysHintUsageCount(startDate: Date, endDate: Date) {
    try {
      const count = await this.prisma.hintUsage.count({
        where: {
          usedAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      });

      console.log(`Hint usage count from ${startDate} to ${endDate}:`, count); // 디버깅 로그
      return count;
    } catch (error) {
      console.error("Error fetching today's hint usage count:", error);
      throw error;
    }
  }
}
