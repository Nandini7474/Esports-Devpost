# OpponentIQ - AI-Powered Esports Scouting Report Generator

## Overview

OpponentIQ is a full-stack web application that automates esports scouting by ingesting match data from the GRID API, aggregating statistics, and using OpenAI to generate tactical scouting reports for coaching staffs. The platform supports VALORANT and League of Legends, delivering actionable intelligence through a dark-themed tactical dashboard.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, bundled via Vite
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state caching and mutations
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for UI transitions
- **Typography**: Custom font stack (Oxanium display, Space Grotesk body, JetBrains Mono monospace)

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript (ESM modules)
- **Build**: esbuild for server bundling, Vite for client
- **API Pattern**: RESTful endpoints defined in `shared/routes.ts` with Zod validation
- **Development**: Hot module replacement via Vite middleware

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` defines tables for reports and match history
- **Migrations**: Managed via `drizzle-kit push`
- **Tables**:
  - `reports`: Stores generated scouting reports with JSON content
  - `match_history`: Caches match data from GRID API for pattern recognition

### AI Integration
- **Provider**: OpenAI via Replit AI Integrations
- **Purpose**: Generates tactical scouting reports from aggregated match statistics
- **Pattern**: Aggregated stats passed to LLM (not raw data) for concise, coach-ready output
- **Location**: `server/routes.ts` handles report generation with structured prompts

### Project Structure
```
├── client/src/          # React frontend
│   ├── components/      # UI components (shadcn/ui + custom)
│   ├── pages/           # Route pages (Home, Reports, ReportDetail)
│   ├── hooks/           # Custom hooks (use-reports, use-toast)
│   └── lib/             # Utilities (queryClient, utils)
├── server/              # Express backend
│   ├── routes.ts        # API endpoint definitions
│   ├── storage.ts       # Database operations
│   ├── grid-client.ts   # GRID API integration (currently mocked)
│   └── replit_integrations/  # AI service clients
├── shared/              # Shared types and schemas
│   ├── schema.ts        # Drizzle table definitions
│   └── routes.ts        # API contract with Zod schemas
└── migrations/          # Database migrations
```

## External Dependencies

### APIs and Services
- **GRID API**: Primary data source for esports match data (requires `GRID_API_KEY` env var)
- **OpenAI**: AI analysis via Replit AI Integrations (`AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL` env vars)
- **PostgreSQL**: Database storage (requires `DATABASE_URL` env var)

### Key npm Packages
- `drizzle-orm` + `drizzle-kit`: Type-safe database ORM and migrations
- `@tanstack/react-query`: Server state management
- `zod`: Runtime type validation for API contracts
- `framer-motion`: Animation library
- `shadcn/ui` components via Radix UI primitives

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `GRID_API_KEY`: GRID.gg API authentication
- `AI_INTEGRATIONS_OPENAI_API_KEY`: OpenAI API key (via Replit)
- `AI_INTEGRATIONS_OPENAI_BASE_URL`: OpenAI base URL (via Replit)