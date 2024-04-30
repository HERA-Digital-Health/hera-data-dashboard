import * as React from 'react';
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
import { HeraVizData } from '../../../models/common';
import { VizSpec } from '../../../models/VizSpec';
import { Visualization } from '../../ui/Visualization';

/**
 * Given the data, guess the best viz type for it.
 * If there is already a selected viz type then just use that one.
 */
function guessVizType(
  vizData: HeraVizData | undefined,
  selectedVizType: VizType | undefined,
): VizType | undefined {
  if (selectedVizType) {
    return selectedVizType;
  }

  if (vizData && vizData.length > 0) {
    const firstObj = vizData[0];
    return 'date' in firstObj ? 'LINE_CHART' : 'BAR_CHART';
  }

  return undefined;
}

type Props = {
  vizSpec: VizSpec;
  onRemoveVisualization: (vizSpec: VizSpec) => void;
  onVizSpecUpdate: (newVizSpec: VizSpec) => void;
};

export function VizBuilder({
  vizSpec,
  onRemoveVisualization,
  onVizSpecUpdate,
}: Props): JSX.Element {
  const [selectedVizType, setSelectedVizType] = React.useState<
    VizType | undefined
  >();

  const onTitleChange = (newTitle: string) => {
    onVizSpecUpdate({
      ...vizSpec,
      title: newTitle,
    });
  };

  const onIndicatorChange = (indicatorName: string) => {
    const selectedIndicator = Indicators.find((indObj) => {
      return indObj.name === indicatorName;
    });

    onVizSpecUpdate({
      ...vizSpec,
      indicator: selectedIndicator,
    });
  };

  const onDateRangeChange = (newDateRange: DateRangePickerValue) => {
    onVizSpecUpdate({
      ...vizSpec,
      dateRange: newDateRange,
    });
  };

  // fetch the data
  const { data, isFetching } = useHeraQuery({
    indicator: vizSpec.indicator,
    dateRange: vizSpec.dateRange,
  });

  const vizType = React.useMemo(() => {
    return guessVizType(data, selectedVizType);
  }, [selectedVizType, data]);

  return (
    <Card className="relative w-fit">
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
        <div className="flex space-x-4">
          <LabelWrapper label="Indicator">
            <Select
              onValueChange={onIndicatorChange}
              value={vizSpec.indicator?.name}
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
              value={vizSpec.dateRange}
            />
          </LabelWrapper>

          <LabelWrapper label="Visualization Type">
            <Select
              onValueChange={(val: string) => {
                return setSelectedVizType(val as VizType);
              }}
              value={vizType}
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
        vizType={vizType}
        vizSpec={vizSpec}
        data={data}
        onTitleChange={onTitleChange}
      />
    </Card>
  );
}
