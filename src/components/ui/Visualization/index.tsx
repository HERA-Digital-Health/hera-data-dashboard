import * as React from 'react';
import * as R from 'remeda';
import { Select, SelectItem, LineChart, BarChart } from '@tremor/react';
import { HeraVizData, VizSpec, VizType } from '../../../models/common';
import { TitleEditor } from '../TitleEditor';

type Props = {
  data: HeraVizData | undefined;
  vizType: VizType | undefined;
  vizSpec: VizSpec;
  className?: string;
  onTitleChange: (newTitle: string) => void;
};

function getSeries(vizData: HeraVizData | undefined): string[] {
  if (vizData && vizData.length > 0) {
    const firstObj = vizData[0];
    const series = R.pipe(firstObj, R.omit(['date']), R.keys);
    return series;
  }

  return [];
}

export function Visualization({
  data,
  vizType,
  vizSpec,
  className,
  onTitleChange,
}: Props): JSX.Element {
  const allSeries = React.useMemo(() => getSeries(data), [data]);

  const renderVisualization = () => {
    if (data && vizType) {
      switch (vizType) {
        case 'BAR_CHART':
          return (
            <BarChart
              index="check_up_no"
              categories={['no_response']}
              className="h-72 w-full"
              data={data}
              yAxisWidth={30}
            />
          );

        case 'LINE_CHART': {
          const firstObj = data[0];

          // take all keys from the object to be categories. But exclude
          // `date` since that's the x-axis
          const categories = firstObj
            ? R.pipe(firstObj, R.omit(['date']), R.keys)
            : [];
          return (
            <LineChart
              className="h-72 w-full"
              data={data}
              categories={categories}
              index="date"
              yAxisWidth={30}
            />
          );
        }
        default:
          throw new Error(`Unsupported vizType: '${vizType}'`);
      }
    }
    return <p className="pt-4 text-center">There is no data to show.</p>;
  };

  const renderVisualizationControls = () => {
    if (data && vizType) {
      return (
        <Select
          onValueChange={() => {
            return [];
          }}
          value={vizType}
          placeholder="Choose series"
        >
          {allSeries.map((seriesKey) => {
            return (
              <SelectItem key={seriesKey} value={seriesKey}>
                {seriesKey}
              </SelectItem>
            );
          })}
        </Select>
      );
    }
    return null;
  };

  // TODO: make the series selector into a multiselect
  return (
    <div className={className}>
      <div className="flex justify-center">
        <TitleEditor onSaveTitle={onTitleChange} title={vizSpec.title} />
      </div>
      {renderVisualization()}
      {renderVisualizationControls()}
    </div>
  );
}
