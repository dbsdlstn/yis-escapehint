// src/modules/hint/hint.service.ts
import { pool } from "../../shared/utils/pg.util";
import { ConflictError } from "../../shared/errors/AppError";

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

  async getHintsByTheme(themeId: string) {
    console.log("Fetching hints for themeId:", themeId); // 디버깅 로그
    try {
      const result = await pool.query(
        'SELECT * FROM "Hint" WHERE "themeId" = $1 ORDER BY "order" ASC',
        [themeId]
      );
      console.log("Found hints:", result.rows.length); // 디버깅 로그
      return result.rows;
    } catch (error) {
      console.error("Error fetching hints:", error); // 디버깅 로그
      throw error;
    }
  }

  async createHint(hintData: CreateHintDto) {
    // Check for duplicate code within the same theme (BR-01)
    const existingHintResult = await pool.query(
      'SELECT id FROM "Hint" WHERE "themeId" = $1 AND "code" = $2',
      [hintData.themeId, hintData.code.toUpperCase()]
    );

    if (existingHintResult.rows.length > 0) {
      throw new ConflictError(`이미 존재하는 힌트 코드입니다: ${hintData.code}`);
    }

    const result = await pool.query(`
      INSERT INTO "Hint" ("themeId", "code", "content", "answer", "progressRate", "order", "isActive")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      hintData.themeId,
      hintData.code.toUpperCase(), // Store code in uppercase for case-insensitive matching
      hintData.content,
      hintData.answer,
      hintData.progressRate,
      hintData.order ?? 0,
      hintData.isActive
    ]);

    return result.rows[0];
  }

  async updateHint(id: string, hintData: UpdateHintDto) {
    // First get the current hint to check themeId
    const currentHintResult = await pool.query('SELECT * FROM "Hint" WHERE id = $1', [id]);

    if (currentHintResult.rows.length === 0) {
      throw new Error('Hint not found');
    }

    const currentHint = currentHintResult.rows[0];

    // If code is being updated, check for duplicate within the same theme
    if (hintData.code && currentHint.code !== hintData.code.toUpperCase()) {
      // Check if the new code already exists for this theme
      const existingHintResult = await pool.query(
        'SELECT id FROM "Hint" WHERE "themeId" = $1 AND "code" = $2 AND id != $3',
        [currentHint.themeId, hintData.code.toUpperCase(), id]
      );

      if (existingHintResult.rows.length > 0) {
        throw new ConflictError(`이미 존재하는 힌트 코드입니다: ${hintData.code}`);
      }
    }

    // Prepare update fields
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 2; // 첫 번째 파라미터는 id이므로 2부터 시작

    if (hintData.code !== undefined) {
      updateFields.push(`"code" = $${paramIndex}`);
      updateValues.push(hintData.code.toUpperCase());
      paramIndex++;
    }

    if (hintData.content !== undefined) {
      updateFields.push(`"content" = $${paramIndex}`);
      updateValues.push(hintData.content);
      paramIndex++;
    }

    if (hintData.answer !== undefined) {
      updateFields.push(`"answer" = $${paramIndex}`);
      updateValues.push(hintData.answer);
      paramIndex++;
    }

    if (hintData.progressRate !== undefined) {
      updateFields.push(`"progressRate" = $${paramIndex}`);
      updateValues.push(hintData.progressRate);
      paramIndex++;
    }

    if (hintData.order !== undefined) {
      updateFields.push(`"order" = $${paramIndex}`);
      updateValues.push(hintData.order);
      paramIndex++;
    }

    if (hintData.isActive !== undefined) {
      updateFields.push(`"isActive" = $${paramIndex}`);
      updateValues.push(hintData.isActive);
      paramIndex++;
    }

    // Perform the update if there are fields to update
    if (updateFields.length > 0) {
      const query = `
        UPDATE "Hint"
        SET ${updateFields.join(', ')}
        WHERE id = $1
        RETURNING *
      `;
      // Add id to the beginning of values array
      const values = [id, ...updateValues];

      const result = await pool.query(query, values);
      return result.rows[0];
    } else {
      // No fields to update, return current hint
      return currentHint;
    }
  }

  async deleteHint(id: string) {
    try {
      const result = await pool.query('DELETE FROM "Hint" WHERE id = $1', [id]);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (_error) {
      return false;
    }
  }

  async updateHintOrder(id: string, order: number) {
    try {
      const result = await pool.query(
        'UPDATE "Hint" SET "order" = $1 WHERE id = $2',
        [order, id]
      );
      return result.rowCount !== null && result.rowCount > 0;
    } catch (_error) {
      return false;
    }
  }
}
