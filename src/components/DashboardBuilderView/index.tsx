import * as React from 'react';
import { Button } from '@tremor/react';
import { VizBuilder } from './VizBuilder';
import { VizSpec, makeDefaultVizSpec } from '../../models/VizSpec';
import { TitleEditor } from '../ui/TitleEditor';
import { toJSON } from '../../utils/jsonUtil';
import { makeDefaultDashboardSpec } from '../../models/DashboardSpec';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export function DashboardBuilderView(): JSX.Element {
  const [dashSpec, setDashSpec] = React.useState(() =>
    makeDefaultDashboardSpec(),
  );

  const onDashTitleChange = (newDashTitle: string) => {
    setDashSpec((prevDashSpec) => {
      return {
        ...prevDashSpec,
        title: newDashTitle,
        slug: slugify(newDashTitle),
      };
    });
  };

  const onAddViz = () => {
    setDashSpec((prevDashSpec) => {
      return {
        ...prevDashSpec,
        visualizations: prevDashSpec.visualizations.concat([
          makeDefaultVizSpec(),
        ]),
      };
    });
  };

  const onRemoveViz = (vizToRemove: VizSpec) => {
    setDashSpec((prevDashSpec) => {
      return {
        ...prevDashSpec,
        visualizations: prevDashSpec.visualizations.filter(
          (viz) => viz.id !== vizToRemove.id,
        ),
      };
    });
  };

  const onVizSpecChange = (updatedViz: VizSpec) => {
    setDashSpec((prevDashSpec) => {
      return {
        ...prevDashSpec,
        visualizations: prevDashSpec.visualizations.map((viz) =>
          viz.id === updatedViz.id ? updatedViz : viz,
        ),
      };
    });
  };

  const onExportVisualization = () => {
    const dashSpecJSONString = JSON.stringify(toJSON(dashSpec));

    // Create a Blob from the JSON string
    const blob = new Blob([dashSpecJSONString], {
      type: 'application/json',
    });

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element and trigger the JSON download
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'dashboard.json';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url); // clean up
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <TitleEditor onSaveTitle={onDashTitleChange} title={dashSpec.title} />
        </div>
        <div className="space-x-2">
          <Button variant="secondary" onClick={onAddViz}>
            + New Viz
          </Button>
          <Button variant="secondary" onClick={onExportVisualization}>
            Export Dashboard
          </Button>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 flex-col items-center justify-center gap-4">
        {dashSpec.visualizations.map((vizSpec) => {
          return (
            <VizBuilder
              key={vizSpec.id}
              vizSpec={vizSpec}
              onVizSpecChange={onVizSpecChange}
              onRemoveVisualization={onRemoveViz}
            />
          );
        })}
      </div>
    </div>
  );
}
