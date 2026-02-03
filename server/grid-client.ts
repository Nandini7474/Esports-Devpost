import { storage } from "./storage";

export class GridClient {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GRID_API_KEY || "";
  }

  async fetchAndProcessMatches(opponent: string, game: string): Promise<any[]> {
    console.log(`[GRID] Fetching and processing matches for ${opponent} in ${game}...`);

    // In a real scenario, this would query GRID's GraphQL API.
    // We simulate fetching 5 recent matches with varying data.
    const matches = game === 'valorant' 
      ? this.getMockValorantMatches(opponent)
      : this.getMockLoLMatches(opponent);

    // Save to historical data storage
    for (const match of matches) {
      await storage.saveMatch({
        game,
        opponent,
        matchId: match.id,
        map: match.map || null,
        result: match.result,
        score: match.score,
        data: match
      });
    }

    return matches;
  }

  private getMockValorantMatches(opponent: string) {
    return [
      { id: "v1", map: "Ascent", score: "13-11", result: "win", agent_composition: ["Jett", "Sova", "Omen", "Killjoy", "KAY/O"], defense_setup: "Standard 2-1-2", timestamp: new Date(Date.now() - 86400000).toISOString() },
      { id: "v2", map: "Haven", score: "9-13", result: "loss", agent_composition: ["Jett", "Breach", "Omen", "Killjoy", "Sova"], defense_setup: "Aggressive C Long", timestamp: new Date(Date.now() - 172800000).toISOString() },
      { id: "v3", map: "Lotus", score: "13-5", result: "win", agent_composition: ["Raze", "Fade", "Omen", "Killjoy", "Viper"], defense_setup: "Retake heavy A", timestamp: new Date(Date.now() - 259200000).toISOString() },
      { id: "v4", map: "Ascent", score: "13-10", result: "win", agent_composition: ["Jett", "Sova", "Omen", "Killjoy", "KAY/O"], defense_setup: "Mid aggression", timestamp: new Date(Date.now() - 345600000).toISOString() },
      { id: "v5", map: "Bind", score: "11-13", result: "loss", agent_composition: ["Raze", "Skye", "Brimstone", "Viper", "Cypher"], defense_setup: "B site anchor", timestamp: new Date(Date.now() - 432000000).toISOString() }
    ];
  }

  private getMockLoLMatches(opponent: string) {
    return [
      { id: "l1", result: "win", score: "24-12", duration: "28:30", picks: ["Renekton", "Viego", "Ahri", "Kai'Sa", "Nautilus"], side: "blue", timestamp: new Date(Date.now() - 86400000).toISOString() },
      { id: "l2", result: "loss", score: "15-28", duration: "32:15", picks: ["K'Sante", "Lee Sin", "Syndra", "Xayah", "Rakan"], side: "red", timestamp: new Date(Date.now() - 172800000).toISOString() },
      { id: "l3", result: "win", score: "30-20", duration: "35:00", picks: ["Jax", "Jarvan IV", "Orianna", "Varus", "Leona"], side: "blue", timestamp: new Date(Date.now() - 259200000).toISOString() },
      { id: "l4", result: "win", score: "22-10", duration: "25:45", picks: ["Renekton", "Maokai", "Ahri", "Ezreal", "Karma"], side: "red", timestamp: new Date(Date.now() - 345600000).toISOString() },
      { id: "l5", result: "loss", score: "18-25", duration: "30:20", picks: ["Aatrox", "Sejuani", "Taliyah", "Tristana", "Alistar"], side: "blue", timestamp: new Date(Date.now() - 432000000).toISOString() }
    ];
  }
}

export const gridClient = new GridClient();
