import { VizSpec, makeDefaultVizSpec, loadVizSpecFromJSON } from '../VizSpec';
import { JSONCompatible } from '../../utils/jsonUtil';

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

/**
 * Load a JSON-serialized dashboard and turn it into a DashboardSpec model.
 * TODO: enforce some validation to make sure this dashboard is valid
 * TODO: add some versioning for dashboard specs and add migrations
 */
export function loadDashboardFromJSON(
  dashboardJSON: JSONCompatible<DashboardSpec>,
): DashboardSpec {
  return {
    ...dashboardJSON,
    visualizations: dashboardJSON.visualizations.map(loadVizSpecFromJSON),
  };
}
