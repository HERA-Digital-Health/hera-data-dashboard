import { Card } from '@tremor/react';
import { VizSpec } from '../../../models/VizSpec';
import { Visualization } from '../../ui/Visualization';
import { useHeraQuery } from '../../../hooks/useHeraQuery';

type Props = {
  vizSpec: VizSpec;
};

export function VisualizationViewer({ vizSpec }: Props): JSX.Element {
  const { data } = useHeraQuery(vizSpec.querySpec);

  // TODO: implement onVizSpecChange
  return (
    <Card>
      <Visualization
        data={data}
        vizSpec={vizSpec}
        onVizSpecChange={() => undefined}
      />
    </Card>
  );
}
