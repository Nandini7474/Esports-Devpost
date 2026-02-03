import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { gridClient } from "./grid-client";
import { openai } from "./replit_integrations/audio/client";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.reports.list.path, async (req, res) => {
    const game = req.query.game as string | undefined;
    const reports = await storage.getReports(game);
    res.json(reports);
  });

  app.get(api.reports.get.path, async (req, res) => {
    const report = await storage.getReport(Number(req.params.id));
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.json(report);
  });

  app.get("/api/players", async (req, res) => {
    const team = req.query.team as string;
    if (!team) return res.status(400).json({ message: "Team is required" });
    const teamPlayers = await storage.getPlayers(team);
    res.json(teamPlayers);
  });

  app.post("/api/analyze-win-probability", async (req, res) => {
    const { playerIds, opponent } = req.body;
    
    const systemPrompt = `You are a win probability calculator for competitive esports.
    Analyze the selected players against the opponent and return a probability and reasoning.
    
    Output JSON:
    {
      "probability": 0.75,
      "reasoning": "Detailed reasoning based on player synergy and opponent weaknesses.",
      "recommendedNextPlayer": "PlayerName",
      "recommendationReason": "Why this player increases win probability."
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyze team [${playerIds.join(", ")}] against ${opponent}` }
      ],
      response_format: { type: "json_object" }
    });

    res.json(JSON.parse(completion.choices[0].message.content || "{}"));
  });

  app.post(api.reports.create.path, async (req, res) => {
    try {
      const { opponent, game } = api.reports.create.input.parse(req.body);

      // 1. Fetch Current Data and save to History
      const currentMatches = await gridClient.fetchAndProcessMatches(opponent, game);

      // 2. Retrieve Historical Data for Pattern Recognition
      const history = await storage.getOpponentMatchHistory(opponent, game);

      // 3. AI Generation with Historical Context
      const systemPrompt = `You are a senior esports analytics architect for ${game.toUpperCase()}.
      Generate an INSTANT ANALYSIS scouting report based on current matches and HISTORICAL match data.
      
      Perform PATTERN RECOGNITION to identify repeated behaviors, strengths, and weaknesses over time.
      
      Output JSON format:
      {
        "summary": "High-level summary of the opponent.",
        "historical_context": "Analysis of their performance trends over recent matches.",
        "pattern_recognition": {
          "strengths": ["list"],
          "weaknesses": ["list"],
          "repeated_behaviors": ["observed patterns like 'always pushes mid' or 'prefers scaling'"]
        },
        "instant_analysis": {
          "current_form": "Evaluation of their most recent 1-2 matches.",
          "key_threats": ["players or specific strategies that are currently peaking"]
        },
        "tendencies": ["list"],
        "strategies": ["list"],
        "exploitable_patterns": ["actionable weaknesses"],
        "preparation": ["specific counter-strategies"],
        "raw_stats_summary": { "winRate": "X%", "matchesAnalyzed": X }
      }`;

      const userPrompt = `
      OPPONENT: ${opponent}
      GAME: ${game}
      
      CURRENT MATCHES:
      ${JSON.stringify(currentMatches)}
      
      HISTORICAL CONTEXT:
      ${JSON.stringify(history)}
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      });

      const reportContent = JSON.parse(completion.choices[0].message.content || "{}");

      // 4. Store the final report
      const newReport = await storage.createReport({
        opponent,
        game,
        content: reportContent
      });

      res.status(201).json(newReport);

    } catch (err) {
      console.error("Report generation failed:", err);
      res.status(500).json({ message: "Failed to generate comprehensive report" });
    }
  });

  return httpServer;
}
