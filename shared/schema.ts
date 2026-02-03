import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  opponent: text("opponent").notNull(),
  game: text("game").notNull(), // 'valorant' | 'lol'
  content: jsonb("content").notNull(), // The structured report from AI
  createdAt: timestamp("created_at").defaultNow(),
});

// Cache for GRID matches to support historical data and pattern recognition
export const matchHistory = pgTable("match_history", {
  id: serial("id").primaryKey(),
  game: text("game").notNull(),
  opponent: text("opponent").notNull(),
  matchId: text("match_id").notNull(),
  map: text("map"),
  result: text("result"),
  score: text("score"),
  data: jsonb("data").notNull(), // Detailed match data
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===
export const insertReportSchema = createInsertSchema(reports).omit({ 
  id: true, 
  createdAt: true 
});

export const insertMatchHistorySchema = createInsertSchema(matchHistory).omit({ 
  id: true, 
  createdAt: true 
});

// === TYPES ===
export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;

export type MatchHistory = typeof matchHistory.$inferSelect;
export type InsertMatchHistory = z.infer<typeof insertMatchHistorySchema>;

// Input for generating a report
export const generateReportSchema = z.object({
  opponent: z.string().min(1, "Opponent name is required"),
  game: z.enum(["valorant", "lol"]),
});

export type GenerateReportRequest = z.infer<typeof generateReportSchema>;

// Structure of the AI Report Content
export interface ScoutingReportContent {
  summary: string;
  historical_context: string;
  pattern_recognition: {
    strengths: string[];
    weaknesses: string[];
    repeated_behaviors: string[];
  };
  instant_analysis: {
    current_form: string;
    key_threats: string[];
  };
  tendencies: string[];
  strategies: string[];
  exploitable_patterns: string[];
  preparation: string[];
  raw_stats_summary?: Record<string, any>;
}
