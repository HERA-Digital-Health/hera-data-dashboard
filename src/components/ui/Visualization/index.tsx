import * as React from 'react';
import * as R from 'remeda';
import {
  MultiSelect,
  MultiSelectItem,
  Select,
  SelectItem,
  LineChart,
  BarChart,
  Switch,
} from '@tremor/react';
import { HeraVizData } from '../../../models/common';
import { VizSpec } from '../../../models/VizSpec';
import { TitleEditor } from '../TitleEditor';
import { LabelWrapper } from '../LabelWrapper';

type Props = {
  data: HeraVizData | undefined;
  vizSpec: VizSpec;
  className?: string;
  onVizSpecChange: (newVizSpec: VizSpec) => void;
};

const VISUALIZATION_HEIGHT = 400;

export function Visualization({
  data,
  vizSpec,
  className,
  onVizSpecChange,
}: Props): JSX.Element {
  // get the first data object which we assume is enough to determine
  // what fields are used in this data frame
  const firstDataObj = React.useMemo(() => {
    if (data && data.length > 0) {
      return data[0];
    }
    return undefined;
  }, [data]);

  const allFields = React.useMemo(() => {
    return firstDataObj ? R.keys(firstDataObj) : [];
  }, [firstDataObj]);

  const allSeries = React.useMemo(
    () => allFields.filter((field) => field !== 'date'),
    [allFields],
  );

  const onTitleChange = (newTitle: string) => {
    onVizSpecChange({
      ...vizSpec,
      title: newTitle,
    });
  };

  const onXAxisChange = (newXAxisField: string) => {
    onVizSpecChange({
      ...vizSpec,
      xAxisField: newXAxisField,
    });
  };

  const onSeriesFieldsChange = (newSeriesFields: readonly string[]) => {
    onVizSpecChange({
      ...vizSpec,
      seriesFields: newSeriesFields,
    });
  };

  const renderVisualization = () => {
    if (data && vizSpec.vizType) {
      switch (vizSpec.vizType) {
        case 'BAR_CHART':
          if (vizSpec.xAxisField === undefined) {
            return (
              <p className="my-2 text-center">
                Please select a field for the X Axis
              </p>
            );
          }

          if (
            vizSpec.seriesFields === undefined ||
            vizSpec.seriesFields.length === 0
          ) {
            return (
              <p className="my-2 text-center">
                Please select the series to visualize.
              </p>
            );
          }

          return (
            <BarChart
              stack={vizSpec.barChartStack ?? false}
              index={vizSpec.xAxisField ?? ''}
              categories={vizSpec.seriesFields as string[]}
              style={{ height: VISUALIZATION_HEIGHT }}
              className="w-full"
              data={data}
              yAxisWidth={30}
            />
          );

        case 'LINE_CHART': {
          if (vizSpec.xAxisField === undefined) {
            return (
              <p className="my-2 text-center">Please select a date field.</p>
            );
          }

          if (
            vizSpec.seriesFields === undefined ||
            vizSpec.seriesFields.length === 0
          ) {
            return (
              <p className="my-2 text-center">
                Please select the series to visualize.
              </p>
            );
          }

          return (
            <LineChart
              className="w-full"
              data={data}
              style={{ height: VISUALIZATION_HEIGHT }}
              categories={vizSpec.seriesFields as string[]}
              index={vizSpec.xAxisField ?? ''}
              yAxisWidth={30}
            />
          );
        }
        default:
          throw new Error(`Unsupported vizType: '${vizSpec.vizType}'`);
      }
    }

    if (data && !vizSpec.vizType) {
      return (
        <p className="pt-4 text-center">Please select a visualization type.</p>
      );
    }
    return <p className="pt-4 text-center">There is no data to show.</p>;
  };

  const renderBarChartControls = () => {
    return (
      <LabelWrapper label="Stacked">
        <Switch
          checked={vizSpec.barChartStack ?? false}
          onChange={(newVal: boolean) =>
            onVizSpecChange({
              ...vizSpec,
              barChartStack: newVal,
            })
          }
        />
      </LabelWrapper>
    );
  };

  const renderLineChartControls = () => {
    return <>Line chart</>;
  };

  const renderVisualizationControls = () => {
    if (data && vizSpec.vizType) {
      return (
        <div className="flex flex-col space-y-2">
          <LabelWrapper label="X Axis">
            <Select
              onValueChange={onXAxisChange}
              value={vizSpec.xAxisField}
              placeholder="Choose X Axis..."
            >
              {allFields.map((fieldKey) => {
                return (
                  <SelectItem key={fieldKey} value={fieldKey}>
                    {fieldKey}
                  </SelectItem>
                );
              })}
            </Select>
          </LabelWrapper>

          <LabelWrapper label="Series">
            <MultiSelect
              onValueChange={onSeriesFieldsChange}
              value={vizSpec.seriesFields as string[] | undefined}
              placeholder="Choose series..."
            >
              {allSeries.map((seriesKey) => {
                return (
                  <MultiSelectItem key={seriesKey} value={seriesKey}>
                    {seriesKey}
                  </MultiSelectItem>
                );
              })}
            </MultiSelect>
          </LabelWrapper>

          {vizSpec.vizType === 'BAR_CHART' ? renderBarChartControls() : null}
          {vizSpec.vizType === 'LINE_CHART' ? renderLineChartControls() : null}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={className}>
      <div className="flex justify-center">
        <TitleEditor
          titleSize="h2"
          onSaveTitle={onTitleChange}
          title={vizSpec.title}
        />
      </div>
      {renderVisualization()}
      {renderVisualizationControls()}
    </div>
  );
}
