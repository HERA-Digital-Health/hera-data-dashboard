export type Indicator = {
  name: string; // Indicator names must be unique
  endpoint: string; // The API endpoint to call for this indicator
};

export type VizType = 'BAR_CHART' | 'LINE_CHART';

// metadata about a visualization type
export type VizTypeMeta = {
  type: VizType;
  displayName: string;
};

export type HeraDataObject = {
  [key: string]: string | number;
} & {
  date?: string; // dates must be in YYYY-MM-DD format
};

export type HeraVizData = HeraDataObject[];
