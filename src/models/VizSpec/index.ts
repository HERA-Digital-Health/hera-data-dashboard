import { v4 as uuidv4 } from 'uuid';
import { Indicator } from '../common';
import { DateRangePickerValue } from '@tremor/react';
import { type VizType } from '../common';
import { JSONCompatible } from '../../utils/jsonUtil';
import { stringToJSDate } from '../../utils/dateUtil';

/**
 * The metadata to describe a Hera query. This represents how we will query the
 * backend API.
 */
export type QuerySpec = {
  indicator?: Indicator;
  dateRange?: DateRangePickerValue;
};

/**
 * `VizSpec` represents how a visualization is both queried and rendered.
 * Inside `VizSpec` there is a `querySpec` nested model. This holds the
 * specification of how we should query the backend API. Everything else that
 * isn't `querySpec` refers to how the visualization should be rendered on the
 * frontend (for example, which visualization type we're choosing or which
 * field is our x-axis).
 */
export type VizSpec = {
  title: string;
  id: string;
  vizType?: VizType;
  xAxisField?: string;
  seriesFields?: readonly string[];
  querySpec: QuerySpec;

  // bar chart controls
  barChartStack?: boolean;

  // date group by controls
  dateGroupBy?: 'day' | 'week' | 'month' | 'year';
};

export function makeDefaultVizSpec(): VizSpec {
  return {
    title: 'Untitled Chart',
    id: uuidv4(),
    querySpec: {},
  };
}

export function loadVizSpecFromJSON(
  vizSpecJSON: JSONCompatible<VizSpec>,
): VizSpec {
  const {
    querySpec: { dateRange: dateRangeJSON },
  } = vizSpecJSON;
  const dateRange = dateRangeJSON
    ? {
        ...dateRangeJSON,
        from: dateRangeJSON?.from
          ? stringToJSDate(dateRangeJSON.from)
          : undefined,
        to: dateRangeJSON?.to ? stringToJSDate(dateRangeJSON.to) : undefined,
      }
    : undefined;

  return {
    ...vizSpecJSON,
    querySpec: {
      ...vizSpecJSON.querySpec,
      dateRange,
    },
  };
}
