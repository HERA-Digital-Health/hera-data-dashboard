import { DASHBOARDS } from '../config/Constants';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { DashboardSpec, loadDashboardFromJSON } from '../models/DashboardSpec';

export function useDashboards(): UseQueryResult<DashboardSpec[]> {
  return useQuery({
    queryKey: ['getAllDashboards'],
    queryFn: async () => {
      const dashboards = await Promise.all(
        DASHBOARDS.map(async (file: string) => {
          const module = await import(
            /* @vite-ignore */
            `../dashboards/${file}?import`
          );
          return module.default;
        }),
      );

      return dashboards.map(loadDashboardFromJSON);
    },
  });
}
