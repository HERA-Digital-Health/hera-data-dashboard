import { VizSpec, makeDefaultVizSpec } from '../VizSpec';

export type DashboardSpec = {
  title: string;
  slug: string;
  visualizations: readonly VizSpec[];
};

export function makeDefaultDashboardSpec(): DashboardSpec {
  return {
    title: 'Untitled Dashboard',
    slug: 'untitled-dashboard',
    visualizations: [makeDefaultVizSpec()],
  };
}
