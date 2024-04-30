import { v4 as uuidv4 } from 'uuid';
import { Indicator } from '../common';
import { DateRangePickerValue } from '@tremor/react';
import { type VizType } from '../common';

/**
 * The metadata to describe a visualization
 */
export type VizSpec = {
  title: string;
  id: string;
  indicator?: Indicator;
  dateRange?: DateRangePickerValue;
  vizType?: VizType;
};

export function makeDefaultVizSpec(): VizSpec {
  return {
    title: 'Untitled Chart',
    id: uuidv4(),
  };
}
