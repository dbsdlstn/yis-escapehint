// src/modules/theme/theme.service.ts
import { PrismaClient } from "@prisma/client";

interface CreateThemeDto {
  name: string;
  description?: string | null;
  playTime: number;
  isActive: boolean;
  difficulty?: string | null;
}

interface UpdateThemeDto {
  name?: string;
  description?: string | null;
  playTime?: number;
  isActive?: boolean;
  difficulty?: string | null;
}

export class ThemeService {
  private prisma = new PrismaClient();

  async getPlayableThemes() {
    return this.prisma.theme.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { hints: true }, // hintCount를 위해
        },
      },
    });
  }

  async getAllThemes() {
    return this.prisma.theme.findMany({
      include: {
        _count: {
          select: { hints: true }, // hintCount를 위해
        },
      },
    });
  }

  async createTheme(themeData: CreateThemeDto) {
    return this.prisma.theme.create({
      data: {
        ...themeData,
        playTime: themeData.playTime,
        isActive: themeData.isActive ?? true,
      },
    });
  }

  async updateTheme(id: string, themeData: UpdateThemeDto) {
    return this.prisma.theme.update({
      where: { id },
      data: themeData,
    });
  }

  async deleteTheme(id: string) {
    try {
      await this.prisma.theme.delete({
        where: { id },
      });
      return true;
    } catch (_error) {
      // If the theme doesn't exist, Prisma will throw an error
      return false;
    }
  }
}
