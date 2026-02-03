# OpponentIQ: AI-Powered Esports Scouting Report Generator

## Problem Statement
In professional esports (VALORANT, League of Legends), coaching staffs spend hours manually scrubbing through match history (VODs, stats sites) to understand opponent tendencies. This manual process is slow, prone to bias, and inefficient.

**OpponentIQ** automates this process by:
1.  Ingesting match data from the **GRID API**.
2.  Normalizing and aggregating statistics.
3.  Using **OpenAI (GPT-5.2)** to reason over the data and generate a "Coach-Ready" scouting report.
4.  Delivering insights in a clean, tactical dashboard.

## Value for Coaches & Players
-   **Time Savings:** Reduces hours of research to seconds.
-   **Objective Analysis:** Removes human bias from initial scouting.
-   **Actionable Intelligence:** Focuses on "Exploitable Patterns" and "Preparation" rather than just raw numbers.

## Architecture
```ascii
+-----------------+       +-------------------+       +----------------------+
|  Frontend (UI)  |       |   Backend (API)   |       |   External Services  |
|  React + Vite   | <---> |  Node.js + Express| <---> |  GRID.gg API (Data)  |
|  Tailwind +     |       |                   |       +----------------------+
|  Framer Motion  |       |                   |                 ^
+-----------------+       +-------------------+                 |
                                   |                            v
                          +-------------------+       +----------------------+
                          |    PostgreSQL     |       |   OpenAI (Analysis)  |
                          |  (Report Storage) |       |   GPT-5.2 Model      |
                          +-------------------+       +----------------------+
```

## Features
-   **Multi-Game Support:** VALORANT and League of Legends.
-   **Smart Data Ingestion:** Fetches recent match history via GRID.
-   **AI Analyst:** Generates textual insights on tendencies, strategies, and weaknesses.
-   **Tactical Dashboard:** Dark-mode UI with collapsible raw stats and clear summaries.
-   **Report History:** Save and review past reports.

## How to Run Locally

1.  **Clone the repository.**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up Environment Variables:**
    -   `GRID_API_KEY`: Your GRID.gg API key.
    -   `DATABASE_URL`: Connection string for PostgreSQL.
    -   (OpenAI keys are managed via Replit Integrations).
4.  **Run the application:**
    ```bash
    npm run dev
    ```
5.  **Access the UI:**
    Open `http://0.0.0.0:5000` in your browser.

## Project Structure
-   `client/`: React frontend (Pages, Components, UI).
-   `server/`: Node.js backend.
    -   `routes.ts`: API endpoints.
    -   `grid-client.ts`: Service to interact with GRID API (includes robust fallback).
    -   `db.ts` & `storage.ts`: Database connection and access layer.
-   `shared/`: Shared Types and Schemas (Drizzle ORM + Zod).
-   `prompts/`: (Logic embedded in `server/routes.ts` for dynamic context).

---
*Built for the GRID Data Hackathon.*
