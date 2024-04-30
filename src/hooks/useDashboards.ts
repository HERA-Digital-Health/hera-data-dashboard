import { DASHBOARDS } from '../config/Constants';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { DashboardSpec } from '../models/DashboardSpec';

// TODO: return value should be a deserialized JSON Dashboard spec
export function useDashboards(): UseQueryResult<DashboardSpec[]> {
  return useQuery({
    queryKey: ['getAllDashboards'],
    queryFn: async () => {
      const dashboards = await Promise.all(
        DASHBOARDS.map(async (file: string) => {
          const module = await import(`../dashboards/${file}?import`);
          return module.default;
        }),
      );

      // TODO: enforce some validation that this dashboard is valid
      return dashboards;
    },
  });
}
