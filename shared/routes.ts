import { z } from 'zod';
import { generateReportSchema, reports } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  reports: {
    list: {
      method: 'GET' as const,
      path: '/api/reports',
      input: z.object({
        game: z.enum(['valorant', 'lol']).optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof reports.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/reports/:id',
      responses: {
        200: z.custom<typeof reports.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/reports',
      input: generateReportSchema,
      responses: {
        201: z.custom<typeof reports.$inferSelect>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
  },
};

// ============================================
// HELPER
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// TYPE HELPERS
// ============================================
export type ReportInput = z.infer<typeof api.reports.create.input>;
export type ReportResponse = z.infer<typeof api.reports.create.responses[201]>;
export type ReportsListResponse = z.infer<typeof api.reports.list.responses[200]>;
