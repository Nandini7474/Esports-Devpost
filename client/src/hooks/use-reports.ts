import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type ReportInput, type ReportResponse } from "@shared/routes";
import { reports } from "@shared/schema";

// GET /api/reports
export function useReports(game?: 'valorant' | 'lol') {
  return useQuery({
    queryKey: [api.reports.list.path, game],
    queryFn: async () => {
      const url = game 
        ? `${api.reports.list.path}?game=${game}`
        : api.reports.list.path;
      
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error('Failed to fetch reports');
      return api.reports.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/reports/:id
export function useReport(id: number) {
  return useQuery({
    queryKey: [api.reports.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.reports.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch report');
      
      return api.reports.get.responses[200].parse(await res.json());
    },
    enabled: !!id && !isNaN(id),
  });
}

// POST /api/reports
export function useCreateReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: ReportInput) => {
      // Validate input before sending
      const validated = api.reports.create.input.parse(data);
      
      const res = await fetch(api.reports.create.path, {
        method: api.reports.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.reports.create.responses[400].parse(await res.json());
          throw new Error(error.message || 'Validation failed');
        }
        if (res.status === 500) {
           const error = api.reports.create.responses[500].parse(await res.json());
           throw new Error(error.message || 'Server error');
        }
        throw new Error('Failed to create report');
      }

      return api.reports.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.reports.list.path] });
    },
  });
}
