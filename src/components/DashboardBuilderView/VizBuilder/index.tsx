import * as R from 'remeda';
import {
  Card,
  SelectItem,
  Select,
  DateRangePicker,
  type DateRangePickerValue,
  Button,
} from '@tremor/react';
import { Icon } from '@tremor/react';
import { RiCloseFill } from '@remixicon/react';
import { useHeraQuery } from '../../../hooks/useHeraQuery';
import { type VizType } from '../../../models/common';
import { Indicators } from '../../../config/Indicators';
import { LabelWrapper } from '../../ui/LabelWrapper';
import { SupportedVisualizations } from '../../../config/Visualizations';
import { VizSpec } from '../../../models/VizSpec';
import { Visualization } from '../../ui/Visualization';

type Props = {
  vizSpec: VizSpec;
  onRemoveVisualization: (vizSpec: VizSpec) => void;
  onVizSpecChange: (newVizSpec: VizSpec) => void;
};

export function VizBuilder({
  vizSpec,
  onRemoveVisualization,
  onVizSpecChange,
}: Props): JSX.Element {
  // fetch the data
  const { data, isFetching } = useHeraQuery(vizSpec.querySpec);

  const onVizTypeChange = (newVizType: VizType) => {
    onVizSpecChange({
      ...vizSpec,
      vizType: newVizType,

      // if there is loaded data and there is a 'date' field, then
      // proactively set it as the xAxis if we've chosen to plot
      // a line graph
      xAxisField:
        newVizType === 'LINE_CHART' &&
        data &&
        data.length > 0 &&
        data[0] &&
        'date' in data[0]
          ? 'date'
          : vizSpec.xAxisField,

      // if there is loaded data and we haven't already chosen the series
      // fields to visualize, then select all of them
      seriesFields:
        newVizType === 'LINE_CHART' &&
        data &&
        data.length > 0 &&
        data[0] &&
        vizSpec.seriesFields === undefined
          ? R.keys(data[0]).filter((key) => key !== 'date')
          : vizSpec.seriesFields,
    });
  };

  const onIndicatorChange = (indicatorName: string) => {
    const selectedIndicator = Indicators.find((indObj) => {
      return indObj.name === indicatorName;
    });

    onVizSpecChange({
      ...vizSpec,
      querySpec: {
        ...vizSpec.querySpec,
        indicator: selectedIndicator,
      },

      // if the indicator has changed, then we clear our x axis
      // and series fields, because these may change entirely
      xAxisField: undefined,
      seriesFields: undefined,
    });
  };

  const onDateRangeChange = (newDateRange: DateRangePickerValue) => {
    onVizSpecChange({
      ...vizSpec,
      querySpec: {
        ...vizSpec.querySpec,
        dateRange: newDateRange,
      },
    });
  };

  return (
    <Card className="relative">
      <div className="absolute right-0 top-0">
        <Button
          variant="light"
          onClick={() => {
            onRemoveVisualization(vizSpec);
          }}
        >
          <Icon color="slate" icon={RiCloseFill} variant="simple" size="sm" />
        </Button>
      </div>
      <form className="space-y-4">
        <div className="flex flex-col">
          <LabelWrapper label="Indicator">
            <Select
              onValueChange={onIndicatorChange}
              value={vizSpec.querySpec.indicator?.name}
            >
              {Indicators.map(({ name }) => {
                return (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                );
              })}
            </Select>
          </LabelWrapper>

          <LabelWrapper label="Date Range">
            <DateRangePicker
              onValueChange={onDateRangeChange}
              value={vizSpec.querySpec.dateRange}
            />
          </LabelWrapper>

          <LabelWrapper label="Visualization Type">
            <Select
              onValueChange={(val: string) => onVizTypeChange(val as VizType)}
              value={vizSpec.vizType}
            >
              {SupportedVisualizations.map(({ type, displayName }) => {
                return (
                  <SelectItem key={type} value={type}>
                    {displayName}
                  </SelectItem>
                );
              })}
            </Select>
          </LabelWrapper>
        </div>
      </form>
      {isFetching ? <p>Fetching...</p> : null}
      <Visualization
        className="pt-4"
        vizSpec={vizSpec}
        data={data}
        onVizSpecChange={onVizSpecChange}
      />
    </Card>
  );
}
