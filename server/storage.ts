import { db } from "./db";
import {
  reports,
  type Report,
  type InsertReport,
  matchHistory,
  type MatchHistory,
  type InsertMatchHistory
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Reports
  createReport(report: InsertReport): Promise<Report>;
  getReport(id: number): Promise<Report | undefined>;
  getReports(game?: string): Promise<Report[]>;
  
  // Match History
  saveMatch(match: InsertMatchHistory): Promise<MatchHistory>;
  getOpponentMatchHistory(opponent: string, game: string): Promise<MatchHistory[]>;
}

export class DatabaseStorage implements IStorage {
  // Reports
  async createReport(report: InsertReport): Promise<Report> {
    const [newReport] = await db.insert(reports).values(report).returning();
    return newReport;
  }

  async getReport(id: number): Promise<Report | undefined> {
    const [report] = await db.select().from(reports).where(eq(reports.id, id));
    return report;
  }

  async getReports(game?: string): Promise<Report[]> {
    let query = db.select().from(reports).orderBy(desc(reports.createdAt));
    if (game) {
      // @ts-ignore
      query = query.where(eq(reports.game, game));
    }
    return await query;
  }

  // Match History
  async saveMatch(match: InsertMatchHistory): Promise<MatchHistory> {
    const [saved] = await db.insert(matchHistory).values(match).returning();
    return saved;
  }

  async getOpponentMatchHistory(opponent: string, game: string): Promise<MatchHistory[]> {
    return await db.select()
      .from(matchHistory)
      .where(
        and(
          eq(matchHistory.opponent, opponent),
          eq(matchHistory.game, game)
        )
      )
      .orderBy(desc(matchHistory.createdAt))
      .limit(10);
  }

  // Players
  async getPlayers(team: string): Promise<Player[]> {
    return await db.select().from(players).where(eq(players.team, team));
  }

  async getPlayer(id: number): Promise<Player | undefined> {
    const [player] = await db.select().from(players).where(eq(players.id, id));
    return player;
  }
}

export const storage = new DatabaseStorage();
