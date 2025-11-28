// src/modules/session/session.service.ts
import { pool } from "../../shared/utils/pg.util";
import {
  HintNotFoundError,
  SessionNotFoundError,
  HintInactiveError,
  HintThemeMismatchError,
  ThemeNotFoundError,
} from "../../shared/errors/AppError";

export class SessionService {

  async createSession(themeId: string) {
    // Verify theme exists
    const themeResult = await pool.query('SELECT id FROM "Theme" WHERE id = $1', [themeId]);

    if (themeResult.rows.length === 0) {
      throw new ThemeNotFoundError(themeId);
    }

    const result = await pool.query(`
      INSERT INTO "GameSession" (id, "themeId", "startTime", "status", "usedHintCount", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
      RETURNING *
    `, [themeId, new Date(), "in_progress", 0]);

    return result.rows[0];
  }

  async getSession(id: string) {
    const result = await pool.query(`
      SELECT gs.*, t.name as "themeName", t.description as "themeDescription",
             t."playTime" as "themePlayTime", t."isActive" as "themeIsActive", t."difficulty" as "themeDifficulty"
      FROM "GameSession" gs
      JOIN "Theme" t ON gs."themeId" = t.id
      WHERE gs.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      throw new SessionNotFoundError(id);
    }

    const session = result.rows[0];
    return {
      ...session,
      theme: {
        id: session.themeId,
        name: session.themeName,
        description: session.themeDescription,
        playTime: session.themePlayTime,
        isActive: session.themeIsActive,
        difficulty: session.themeDifficulty,
      }
    };
  }

  async getSessions(filter?: { status?: string }) {
    let query = `
      SELECT gs.*, t.name as "themeName", t.description as "themeDescription",
             t."playTime" as "themePlayTime", t."isActive" as "themeIsActive", t."difficulty" as "themeDifficulty"
      FROM "GameSession" gs
      JOIN "Theme" t ON gs."themeId" = t.id
    `;
    const params: any[] = [];

    if (filter?.status) {
      query += ` WHERE gs."status" = $1`;
      params.push(filter.status);
    }

    const result = await pool.query(query, params);

    return result.rows.map(session => ({
      ...session,
      theme: {
        id: session.themeId,
        name: session.themeName,
        description: session.themeDescription,
        playTime: session.themePlayTime,
        isActive: session.themeIsActive,
        difficulty: session.themeDifficulty,
      }
    }));
  }

  async submitHint(sessionId: string, code: string) {
    // Use a transaction to ensure data consistency
    return pool.query('BEGIN').then(async () => {
      try {
        // First get the session
        const sessionResult = await pool.query('SELECT id, "themeId" FROM "GameSession" WHERE id = $1', [sessionId]);

        if (sessionResult.rows.length === 0) {
          throw new SessionNotFoundError(sessionId);
        }

        const session = sessionResult.rows[0];

        // Find the hint by code - this should be optimized with proper indexing
        const hintResult = await pool.query('SELECT * FROM "Hint" WHERE code = $1', [code.toUpperCase()]);

        // BR-06: Handle different types of hint code validation failures
        if (hintResult.rows.length === 0) {
          throw new HintNotFoundError(code);
        }

        const hint = hintResult.rows[0];

        // Check if the hint is for the correct theme
        if (hint.themeId !== session.themeId) {
          throw new HintThemeMismatchError(code);
        }

        // Check if the hint is inactive
        if (!hint.isActive) {
          throw new HintInactiveError(code);
        }

        // Check if hint was already used in this session
        const existingUsageResult = await pool.query(
          'SELECT id FROM "HintUsage" WHERE "sessionId" = $1 AND "hintId" = $2',
          [sessionId, hint.id]
        );

        if (existingUsageResult.rows.length === 0) {
          // Record hint usage
          await pool.query(`
            INSERT INTO "HintUsage" (id, "sessionId", "hintId", "usedAt")
            VALUES (gen_random_uuid(), $1, $2, NOW())
          `, [sessionId, hint.id]);

          // Increment hint count
          await pool.query(
            'UPDATE "GameSession" SET "usedHintCount" = "usedHintCount" + 1, "updatedAt" = NOW() WHERE id = $1',
            [sessionId]
          );
        }

        // Calculate progress rate based on the highest progress of all hints used
        // Only include hints for this specific session to avoid performance issues
        const hintUsagesResult = await pool.query(`
          SELECT h."progressRate"
          FROM "HintUsage" hu
          JOIN "Hint" h ON hu."hintId" = h.id
          WHERE hu."sessionId" = $1
        `, [sessionId]);

        // Calculate max progress rate, default to 0 if no hints have been used
        const progressRates = hintUsagesResult.rows.map(usage => usage.progressRate);
        const maxProgressRate = progressRates.length > 0 ? Math.max(...progressRates) : 0;

        await pool.query('COMMIT');

        return {
          hint,
          progressRate: maxProgressRate,
          alreadyUsed: existingUsageResult.rows.length > 0,
        };
      } catch (error) {
        await pool.query('ROLLBACK');
        throw error;
      }
    });
  }

  async endSession(id: string) {
    const sessionResult = await pool.query('SELECT id FROM "GameSession" WHERE id = $1', [id]);

    if (sessionResult.rows.length === 0) {
      throw new SessionNotFoundError(id);
    }

    await pool.query(
      'UPDATE "GameSession" SET "status" = $1, "endTime" = $2, "updatedAt" = NOW() WHERE id = $3',
      ["aborted", new Date(), id]
    );
  }

  /**
   * 오늘 사용된 힌트 수를 가져옵니다.
   * @param startDate 오늘 자정
   * @param endDate 내일 자정
   * @returns 오늘 사용된 힌트 수
   */
  async getTodaysHintUsageCount(startDate: Date, endDate: Date) {
    try {
      const result = await pool.query(
        'SELECT COUNT(*) FROM "HintUsage" WHERE "usedAt" >= $1 AND "usedAt" < $2',
        [startDate, endDate]
      );

      const count = parseInt(result.rows[0].count);
      console.log(`Hint usage count from ${startDate} to ${endDate}:`, count); // 디버깅 로그
      return count;
    } catch (error) {
      console.error("Error fetching today's hint usage count:", error);
      throw error;
    }
  }
}
