// src/modules/theme/theme.service.ts
import { prisma } from "../../shared/utils/prisma.util";
import logger from "../../shared/utils/logger.util";

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
  private prisma = prisma;

  async getPlayableThemes() {
    try {
      const themes = await this.prisma.theme.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: { hints: true }, // hintCount를 위해
          },
        },
      });

      // Map the result to include hintCount as a direct property
      return themes.map(theme => ({
        ...theme,
        hintCount: theme._count.hints,
      }));
    } catch (error) {
      logger.error("Error fetching playable themes:", error);
      throw error;
    }
  }

  async getAllThemes() {
    try {
      const themes = await this.prisma.theme.findMany({
        include: {
          _count: {
            select: { hints: true }, // hintCount를 위해
          },
        },
      });

      // Map the result to include hintCount as a direct property
      return themes.map(theme => ({
        ...theme,
        hintCount: theme._count.hints,
      }));
    } catch (error) {
      logger.error("Error fetching all themes:", error);
      throw error;
    }
  }

  async getThemeById(id: string) {
    try {
      const theme = await this.prisma.theme.findUnique({
        where: { id },
        include: {
          _count: {
            select: { hints: true },
          },
        },
      });

      if (!theme) {
        return null;
      }

      return {
        ...theme,
        hintCount: theme._count.hints,
      };
    } catch (error) {
      logger.error(`Error fetching theme by id ${id}:`, error);
      throw error;
    }
  }

  async createTheme(themeData: CreateThemeDto) {
    try {
      // Validate input data
      if (!themeData.name || themeData.name.trim().length === 0) {
        throw new Error("Theme name is required");
      }

      if (themeData.playTime <= 0) {
        throw new Error("Play time must be greater than 0");
      }

      if (themeData.playTime < 10 || themeData.playTime > 180) {
        throw new Error("Play time must be between 10 and 180 minutes");
      }

      // Check if a theme with the same name already exists (case-insensitive)
      const existingTheme = await this.prisma.theme.findFirst({
        where: {
          name: {
            mode: "insensitive",
            equals: themeData.name.trim(),
          },
        },
      });

      if (existingTheme) {
        throw new Error("A theme with this name already exists");
      }

      const theme = await this.prisma.theme.create({
        data: {
          name: themeData.name.trim(),
          description: themeData.description || null,
          playTime: themeData.playTime,
          isActive: themeData.isActive ?? true,
          difficulty: themeData.difficulty || null,
        },
      });

      // Return the theme with hintCount set to 0 since it's newly created
      return {
        ...theme,
        hintCount: 0,
      };
    } catch (error) {
      logger.error("Error creating theme:", error);
      throw error;
    }
  }

  async updateTheme(id: string, themeData: UpdateThemeDto) {
    try {
      // Check if theme exists
      const existingTheme = await this.prisma.theme.findUnique({
        where: { id },
        include: {
          _count: {
            select: { hints: true },
          },
        },
      });

      if (!existingTheme) {
        return null;
      }

      // Prepare update data with validation
      const updateData: any = {};

      if (themeData.name !== undefined) {
        if (!themeData.name || themeData.name.trim().length === 0) {
          throw new Error("Theme name is required");
        }

        // Check if a theme with the same name already exists (excluding current theme)
        const existingThemeWithSameName = await this.prisma.theme.findFirst({
          where: {
            name: {
              mode: "insensitive",
              equals: themeData.name.trim(),
            },
            id: {
              not: id,
            },
          },
        });

        if (existingThemeWithSameName) {
          throw new Error("A theme with this name already exists");
        }

        updateData.name = themeData.name.trim();
      }

      if (themeData.playTime !== undefined) {
        if (themeData.playTime < 10 || themeData.playTime > 180) {
          throw new Error("Play time must be between 10 and 180 minutes");
        }
        updateData.playTime = themeData.playTime;
      }

      if (themeData.description !== undefined) {
        updateData.description = themeData.description !== null ? themeData.description : null;
      }

      if (themeData.isActive !== undefined) {
        updateData.isActive = themeData.isActive;
      }

      if (themeData.difficulty !== undefined) {
        updateData.difficulty = themeData.difficulty !== null ? themeData.difficulty : null;
      }

      // Perform the update
      const updatedTheme = await this.prisma.theme.update({
        where: { id },
        data: updateData,
      });

      return {
        ...updatedTheme,
        hintCount: existingTheme._count.hints,
      };
    } catch (error) {
      logger.error(`Error updating theme with id ${id}:`, error);
      throw error;
    }
  }

  async deleteTheme(id: string) {
    try {
      // Check if the theme exists and if there are any in-progress game sessions associated with it
      const themeWithSessions = await this.prisma.theme.findUnique({
        where: { id },
        include: {
          sessions: {
            where: {
              status: "in_progress",
            },
          },
        },
      });

      if (!themeWithSessions) {
        return false; // Theme doesn't exist
      }

      // If there are in-progress sessions, we should not allow deletion
      if (themeWithSessions.sessions.length > 0) {
        throw new Error("Cannot delete theme with in-progress game sessions");
      }

      // Delete the theme (Prisma will handle cascade deletion for hints due to the schema)
      await this.prisma.theme.delete({
        where: { id },
      });

      logger.info(`Theme with id ${id} deleted successfully`);
      return true;
    } catch (error) {
      if (error instanceof Error && error.message === "Cannot delete theme with in-progress game sessions") {
        logger.warn(`Attempt to delete theme ${id} with in-progress sessions`);
        throw error;
      }

      logger.error(`Error deleting theme with id ${id}:`, error);
      return false;
    }
  }

  async getThemeCount() {
    try {
      return await this.prisma.theme.count();
    } catch (error) {
      logger.error("Error fetching theme count:", error);
      throw error;
    }
  }
}
