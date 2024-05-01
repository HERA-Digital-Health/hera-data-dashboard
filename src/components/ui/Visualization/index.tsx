import * as React from 'react';
import * as R from 'remeda';
import {
  Button,
  MultiSelect,
  MultiSelectItem,
  Select,
  SelectItem,
  LineChart,
  BarChart,
  Switch,
  Icon,
} from '@tremor/react';
import { HeraVizData } from '../../../models/common';
import { VizSpec } from '../../../models/VizSpec';
import { TitleEditor } from '../TitleEditor';
import { LabelWrapper } from '../LabelWrapper';
import { RiArrowUpSLine, RiArrowDownSLine } from '@remixicon/react';
import { stringToDateTime } from '../../../utils/dateUtil';

type Props = {
  editorMode: boolean;
  data: HeraVizData | undefined;
  vizSpec: VizSpec;
  className?: string;
  onVizSpecChange: (newVizSpec: VizSpec) => void;
};

const VISUALIZATION_HEIGHT = 400;

function bucketByField(
  data: HeraVizData,
  bucketOptions?:
    | {
        dateGranularity: 'day' | 'week' | 'month' | 'year';
      }
    | {
        fieldKey: string;
      },
) {
  if (data.length === 0) {
    return [];
  }

  if (!bucketOptions) {
    return data;
  }

  // bucket into arrays per date dateGranularity
  // (e.g. an array of data objects per month)
  const bucketedObjects = R.groupBy(data, (dataObj) => {
    if (
      'date' in dataObj &&
      dataObj.date &&
      'dateGranularity' in bucketOptions
    ) {
      const date = dataObj.date;

      switch (bucketOptions.dateGranularity) {
        case 'day':
          return stringToDateTime(date).toFormat('yyyy-MM-dd');
        case 'week':
          return stringToDateTime(date).startOf('week').toFormat('yyyy-MM-dd');
        case 'month':
          return stringToDateTime(date).startOf('month').toFormat('yyyy-MM');
        case 'year':
          return stringToDateTime(date).startOf('year').toFormat('yyyy');
      }
    }

    if ('fieldKey' in bucketOptions && bucketOptions.fieldKey in dataObj) {
      return dataObj[bucketOptions.fieldKey];
    }

    return undefined;
  });

  const keyToBucketBy =
    'dateGranularity' in bucketOptions ? 'date' : bucketOptions.fieldKey;

  // now sum up the arrays
  const aggregatedBuckets = R.mapValues(bucketedObjects, (dataObjects) => {
    if (dataObjects.length === 0) {
      return [];
    }

    // exclude the bucket key from the keys, so we can add it back later
    const keys = Object.keys(dataObjects[0]).filter(
      (key) => key !== keyToBucketBy,
    );
    const aggregatedDataObj = R.mapToObj(keys, (key) => [
      key,
      undefined as undefined | number,
    ]);

    dataObjects.forEach((dataObj) => {
      keys.forEach((key) => {
        if (typeof dataObj[key] === 'number') {
          const newVal = dataObj[key] as number;
          const currVal = aggregatedDataObj[key];
          if (currVal === undefined) {
            aggregatedDataObj[key] = newVal;
          } else {
            aggregatedDataObj[key] = newVal + currVal;
          }
        }
      });
    });

    return aggregatedDataObj;
  });

  // and now convert it back to a HeraVizData array
  return R.pipe(
    aggregatedBuckets,
    R.entries,
    R.map(([bucketedVal, dataObj]) => {
      return {
        ...dataObj,
        [keyToBucketBy]: bucketedVal,
      };
    }),
    R.sortBy((obj) => obj.date),
  );
}

export function Visualization({
  editorMode,
  data,
  vizSpec,
  className,
  onVizSpecChange,
}: Props): JSX.Element {
  const [showVizControls, setShowVizControls] = React.useState(editorMode);

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
      dateGroupBy: newXAxisField === 'date' ? 'day' : undefined,
    });
  };

  const onSeriesFieldsChange = (newSeriesFields: readonly string[]) => {
    onVizSpecChange({
      ...vizSpec,
      seriesFields: newSeriesFields,
    });
  };

  const processedData: HeraVizData | undefined = React.useMemo(() => {
    if (data && vizSpec.dateGroupBy) {
      return bucketByField(data, {
        dateGranularity: vizSpec.dateGroupBy,
      });
    }

    if (data && vizSpec.vizType === 'BAR_CHART' && vizSpec.xAxisField) {
      return bucketByField(data, {
        fieldKey: vizSpec.xAxisField,
      });
    }
    return data;
  }, [data, vizSpec.dateGroupBy, vizSpec.vizType, vizSpec.xAxisField]);

  const renderVisualization = () => {
    if (processedData && vizSpec.vizType) {
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

          console.log('og data', data);
          console.log('processed data', processedData);

          return (
            <BarChart
              stack={vizSpec.barChartStack ?? false}
              index={vizSpec.xAxisField ?? ''}
              categories={vizSpec.seriesFields as string[]}
              style={{ height: VISUALIZATION_HEIGHT }}
              className="w-full"
              data={processedData}
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
              data={processedData}
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

    if (processedData && !vizSpec.vizType) {
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

  const renderDateGroupByControl = () => {
    return (
      <LabelWrapper label="Group date by">
        <Select
          onValueChange={(val: string) => {
            onVizSpecChange({
              ...vizSpec,
              dateGroupBy: val as VizSpec['dateGroupBy'],
            });
          }}
          value={vizSpec.dateGroupBy}
          placeholder="Group date by..."
        >
          <SelectItem value="day">Day</SelectItem>
          <SelectItem value="week">Week</SelectItem>
          <SelectItem value="month">Month</SelectItem>
          <SelectItem value="year">Year</SelectItem>
        </Select>
      </LabelWrapper>
    );
  };

  const renderVisualizationControls = () => {
    if (processedData && vizSpec.vizType) {
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
          {vizSpec.xAxisField === 'date' ? renderDateGroupByControl() : null}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={className}>
      <div className="flex justify-center">
        <TitleEditor
          allowEdit={editorMode}
          titleSize="h2"
          onSaveTitle={onTitleChange}
          title={vizSpec.title}
        />
      </div>
      {renderVisualization()}
      {vizSpec.vizType !== undefined ? (
        <>
          <Button
            variant="light"
            color="slate"
            className="pb-2 pt-3 text-sm font-medium"
            onClick={() => {
              setShowVizControls((prev) => !prev);
            }}
          >
            <div className="flex items-center">
              Settings
              <span style={{ marginLeft: -4 }}>
                {showVizControls ? (
                  <Icon icon={RiArrowUpSLine} size="sm" color="slate" />
                ) : (
                  <Icon icon={RiArrowDownSLine} size="sm" color="slate" />
                )}
              </span>
            </div>
          </Button>

          {showVizControls ? (
            <div className="pl-3">{renderVisualizationControls()}</div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
