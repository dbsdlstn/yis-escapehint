// src/modules/hint/hint.service.ts
import { prisma } from "../../shared/utils/prisma.util";
import { ConflictError, ValidationError } from "../../shared/errors/AppError";

interface CreateHintDto {
  themeId: string;
  code: string;
  content: string;
  answer: string;
  progressRate: number;
  order?: number;
  isActive: boolean;
}

interface UpdateHintDto {
  code?: string;
  content?: string;
  answer?: string;
  progressRate?: number;
  order?: number;
  isActive?: boolean;
}

export class HintService {
  private prisma = prisma;

  async getHintsByTheme(themeId: string) {
    console.log('Fetching hints for themeId:', themeId); // 디버깅 로그
    try {
      const hints = await this.prisma.hint.findMany({
        where: { themeId },
        orderBy: { order: "asc" },
      });
      console.log('Found hints:', hints.length); // 디버깅 로그
      return hints;
    } catch (error) {
      console.error('Error fetching hints:', error); // 디버깅 로그
      throw error;
    }
  }

  async createHint(hintData: CreateHintDto) {
    // Check for duplicate code within the same theme (BR-01)
    const existingHint = await this.prisma.hint.findFirst({
      where: {
        themeId: hintData.themeId,
        code: hintData.code.toUpperCase(),
      },
    });

    if (existingHint) {
      throw new ConflictError(`이미 존재하는 힌트 코드입니다: ${hintData.code}`);
    }

    return this.prisma.hint.create({
      data: {
        ...hintData,
        code: hintData.code.toUpperCase(), // Store code in uppercase for case-insensitive matching
        order: hintData.order ?? 0,
      },
    });
  }

  async updateHint(id: string, hintData: UpdateHintDto) {
    // If code is being updated, check for duplicate within the same theme
    if (hintData.code) {
      const hint = await this.prisma.hint.findUnique({
        where: { id },
      });

      if (hint && hint.code !== hintData.code.toUpperCase()) {
        // Check if the new code already exists for this theme
        const existingHint = await this.prisma.hint.findFirst({
          where: {
            themeId: hint.themeId,
            code: hintData.code.toUpperCase(),
            NOT: { id }, // Exclude the hint being updated
          },
        });

        if (existingHint) {
          throw new ConflictError(`이미 존재하는 힌트 코드입니다: ${hintData.code}`);
        }
      }
    }

    return this.prisma.hint.update({
      where: { id },
      data: {
        ...hintData,
        code: hintData.code ? hintData.code.toUpperCase() : undefined,
      },
    });
  }

  async deleteHint(id: string) {
    try {
      await this.prisma.hint.delete({
        where: { id },
      });
      return true;
    } catch (_error) {
      return false;
    }
  }

  async updateHintOrder(id: string, order: number) {
    try {
      await this.prisma.hint.update({
        where: { id },
        data: { order },
      });
      return true;
    } catch (_error) {
      return false;
    }
  }
}
