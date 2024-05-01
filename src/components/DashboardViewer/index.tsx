import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useDashboards } from '../../hooks/useDashboards';
import { Heading } from '../ui/Heading';
import { VisualizationViewer } from './VisualizationViewer';

export function DashboardViewer(): JSX.Element {
  const urlParams = useParams();
  const slugFromURL = urlParams.slug;
  const { data: allDashboards, isLoading } = useDashboards();

  const dashboard = React.useMemo(() => {
    if (allDashboards) {
      const requestedDashboard = allDashboards.find(
        (dash) => dash.slug === slugFromURL,
      );
      return requestedDashboard;
    }
    return undefined;
  }, [slugFromURL, allDashboards]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (dashboard === undefined) {
    return <div>Could not find the dashboard</div>;
  }

  return (
    <div className="flex w-full flex-col items-center">
      <Heading size="h1">{dashboard.title}</Heading>
      <div
        className="mt-4 grid w-full grid-cols-2 gap-4"
        style={{ maxWidth: 1400 }}
      >
        {dashboard.visualizations.map((vizSpec) => {
          return (
            <VisualizationViewer key={vizSpec.id} defaultVizSpec={vizSpec} />
          );
        })}
      </div>
    </div>
  );
}
