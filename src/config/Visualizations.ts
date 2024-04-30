import type { VizTypeMeta } from '../models/common';

export const SupportedVisualizations: readonly VizTypeMeta[] = [
  {
    type: 'BAR_CHART',
    displayName: 'Bar Chart',
  },
  {
    type: 'LINE_CHART',
    displayName: 'LineChart',
  },
];
