// src/modules/session/session.service.ts
import { PrismaClient } from "@prisma/client";
import { HintService } from "../hint/hint.service";

export class SessionService {
  private prisma = new PrismaClient();
  private hintService = new HintService();

  async createSession(themeId: string) {
    // Verify theme exists
    const theme = await this.prisma.theme.findUnique({
      where: { id: themeId },
    });

    if (!theme) {
      throw new Error("Theme not found");
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
    return this.prisma.gameSession.findUnique({
      where: { id },
      include: {
        theme: true,
      },
    });
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
    // First get the session
    const session = await this.prisma.gameSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return null;
    }

    // Find the hint by code and theme
    const hint = await this.prisma.hint.findFirst({
      where: {
        themeId: session.themeId,
        code: code.toUpperCase(),
        isActive: true,
      },
    });

    if (!hint) {
      return null;
    }

    // Check if hint was already used in this session
    const existingUsage = await this.prisma.hintUsage.findFirst({
      where: {
        sessionId,
        hintId: hint.id,
      },
    });

    if (!existingUsage) {
      // Record hint usage
      await this.prisma.hintUsage.create({
        data: {
          sessionId,
          hintId: hint.id,
        },
      });

      // Increment hint count
      await this.prisma.gameSession.update({
        where: { id: sessionId },
        data: { usedHintCount: { increment: 1 } },
      });
    }

    // Calculate progress rate based on the highest progress of all hints used
    const hintUsages = await this.prisma.hintUsage.findMany({
      where: { sessionId },
      include: { hint: true },
    });

    const maxProgressRate = Math.max(0, ...hintUsages.map(usage => usage.hint.progressRate));

    return {
      hint,
      progressRate: maxProgressRate,
      alreadyUsed: !!existingUsage,
    };
  }

  async endSession(id: string) {
    try {
      await this.prisma.gameSession.update({
        where: { id },
        data: {
          status: "aborted",
          endTime: new Date(),
        },
      });
      return true;
    } catch (_error) {
      return false;
    }
  }
}
