import { DASHBOARDS } from '../config/Dashboards';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { DashboardSpec, loadDashboardFromJSON } from '../models/DashboardSpec';

export function useDashboards(): UseQueryResult<DashboardSpec[]> {
  return useQuery({
    queryKey: ['getAllDashboards'],
    queryFn: async () => {
      return Promise.resolve(
        // @ts-expect-error this is safe
        DASHBOARDS.map(loadDashboardFromJSON),
      );
    },
  });
}
