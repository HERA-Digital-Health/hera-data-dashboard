import { v4 as uuidv4 } from 'uuid';
import { Indicator } from '../common';
import { DateRangePickerValue } from '@tremor/react';
import { type VizType } from '../common';
import { JSONCompatible } from '../../utils/jsonUtil';
import { stringToJSDate } from '../../utils/dateUtil';

/**
 * The metadata to describe a Hera query
 */
export type QuerySpec = {
  indicator?: Indicator;
  dateRange?: DateRangePickerValue;
};

/**
 * The metadata to describe a visualization
 */
export type VizSpec = {
  title: string;
  id: string;
  vizType?: VizType;
  xAxisField?: string;
  seriesFields?: readonly string[];
  querySpec: QuerySpec;
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
