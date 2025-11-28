// src/modules/theme/theme.service.ts
import { pool } from "../../shared/utils/pg.util";
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
  async getPlayableThemes() {
    try {
      const result = await pool.query(`
        SELECT
          t.*,
          (SELECT COUNT(*) FROM "Hint" h WHERE h."themeId" = t.id) AS "hintCount"
        FROM "Theme" t
        WHERE t."isActive" = true
      `);

      return result.rows;
    } catch (error) {
      logger.error("Error fetching playable themes:", error);
      throw error;
    }
  }

  async getAllThemes() {
    try {
      const result = await pool.query(`
        SELECT
          t.*,
          (SELECT COUNT(*) FROM "Hint" h WHERE h."themeId" = t.id) AS "hintCount"
        FROM "Theme" t
      `);

      return result.rows;
    } catch (error) {
      logger.error("Error fetching all themes:", error);
      throw error;
    }
  }

  async getThemeById(id: string) {
    try {
      const result = await pool.query(`
        SELECT
          t.*,
          (SELECT COUNT(*) FROM "Hint" h WHERE h."themeId" = t.id) AS "hintCount"
        FROM "Theme" t
        WHERE t.id = $1
      `, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
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
      const existingThemeResult = await pool.query(
        'SELECT id FROM "Theme" WHERE LOWER("name") = LOWER($1)',
        [themeData.name.trim()]
      );

      if (existingThemeResult.rows.length > 0) {
        throw new Error("A theme with this name already exists");
      }

      // Insert new theme
      const result = await pool.query(`
        INSERT INTO "Theme" ("name", "description", "playTime", "isActive", "difficulty")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [
        themeData.name.trim(),
        themeData.description || null,
        themeData.playTime,
        themeData.isActive ?? true,
        themeData.difficulty || null
      ]);

      // Return the theme with hintCount set to 0 since it's newly created
      return {
        ...result.rows[0],
        hintCount: 0
      };
    } catch (error) {
      logger.error("Error creating theme:", error);
      throw error;
    }
  }

  async updateTheme(id: string, themeData: UpdateThemeDto) {
    try {
      // Check if theme exists
      const existingThemeResult = await pool.query(`
        SELECT
          t.*,
          (SELECT COUNT(*) FROM "Hint" h WHERE h."themeId" = t.id) AS "hintCount"
        FROM "Theme" t
        WHERE t.id = $1
      `, [id]);

      if (existingThemeResult.rows.length === 0) {
        return null;
      }

      const existingTheme = existingThemeResult.rows[0];

      // Prepare update data with validation
      const updateFields: string[] = [];
      const updateValues: any[] = [];
      let paramIndex = 2; // 첫 번째 파라미터는 id이므로 2부터 시작

      if (themeData.name !== undefined) {
        if (!themeData.name || themeData.name.trim().length === 0) {
          throw new Error("Theme name is required");
        }

        // Check if a theme with the same name already exists (excluding current theme)
        const existingThemeWithSameNameResult = await pool.query(
          'SELECT id FROM "Theme" WHERE LOWER("name") = LOWER($1) AND id != $2',
          [themeData.name.trim(), id]
        );

        if (existingThemeWithSameNameResult.rows.length > 0) {
          throw new Error("A theme with this name already exists");
        }

        updateFields.push(`"name" = $${paramIndex}`);
        updateValues.push(themeData.name.trim());
        paramIndex++;
      }

      if (themeData.playTime !== undefined) {
        if (themeData.playTime < 10 || themeData.playTime > 180) {
          throw new Error("Play time must be between 10 and 180 minutes");
        }
        updateFields.push(`"playTime" = $${paramIndex}`);
        updateValues.push(themeData.playTime);
        paramIndex++;
      }

      if (themeData.description !== undefined) {
        updateFields.push(`"description" = $${paramIndex}`);
        updateValues.push(themeData.description !== null ? themeData.description : null);
        paramIndex++;
      }

      if (themeData.isActive !== undefined) {
        updateFields.push(`"isActive" = $${paramIndex}`);
        updateValues.push(themeData.isActive);
        paramIndex++;
      }

      if (themeData.difficulty !== undefined) {
        updateFields.push(`"difficulty" = $${paramIndex}`);
        updateValues.push(themeData.difficulty !== null ? themeData.difficulty : null);
        paramIndex++;
      }

      // Perform the update if there are fields to update
      if (updateFields.length > 0) {
        const query = `
          UPDATE "Theme"
          SET ${updateFields.join(', ')}
          WHERE id = $1
          RETURNING *
        `;
        // Add id to the beginning of values array
        const values = [id, ...updateValues];

        const result = await pool.query(query, values);
        return {
          ...result.rows[0],
          hintCount: existingTheme.hintCount
        };
      } else {
        // No fields to update, return existing theme
        return existingTheme;
      }
    } catch (error) {
      logger.error(`Error updating theme with id ${id}:`, error);
      throw error;
    }
  }

  async deleteTheme(id: string) {
    try {
      // Check if the theme exists and if there are any in-progress game sessions associated with it
      const themeWithSessionsResult = await pool.query(`
        SELECT t.id
        FROM "Theme" t
        LEFT JOIN "GameSession" gs ON t.id = gs."themeId"
        WHERE t.id = $1 AND (gs."status" = 'in_progress' OR gs."status" IS NULL)
      `, [id]);

      // We need to check specifically for in-progress sessions
      const themeWithInProgressSessionsResult = await pool.query(`
        SELECT gs.id
        FROM "GameSession" gs
        WHERE gs."themeId" = $1 AND gs."status" = 'in_progress'
      `, [id]);

      if (themeWithSessionsResult.rows.length === 0) {
        return false; // Theme doesn't exist
      }

      // If there are in-progress sessions, we should not allow deletion
      if (themeWithInProgressSessionsResult.rows.length > 0) {
        throw new Error("Cannot delete theme with in-progress game sessions");
      }

      // Delete the theme (PostgreSQL will handle cascade deletion for hints due to the schema)
      await pool.query('DELETE FROM "Theme" WHERE id = $1', [id]);

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
      const result = await pool.query('SELECT COUNT(*) FROM "Theme"');
      return parseInt(result.rows[0].count);
    } catch (error) {
      logger.error("Error fetching theme count:", error);
      throw error;
    }
  }
}
