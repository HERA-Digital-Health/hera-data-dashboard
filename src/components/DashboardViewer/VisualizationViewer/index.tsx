import * as React from 'react';
import { Card } from '@tremor/react';
import { VizSpec } from '../../../models/VizSpec';
import { Visualization } from '../../ui/Visualization';
import { useHeraQuery } from '../../../hooks/useHeraQuery';

type Props = {
  defaultVizSpec: VizSpec;
};

export function VisualizationViewer({ defaultVizSpec }: Props): JSX.Element {
  const [vizSpec, setVizSpec] = React.useState(defaultVizSpec);
  const { data } = useHeraQuery(vizSpec.querySpec);

  return (
    <Card className="h-fit">
      <Visualization
        editorMode={false}
        data={data}
        vizSpec={vizSpec}
        onVizSpecChange={setVizSpec}
      />
    </Card>
  );
}
