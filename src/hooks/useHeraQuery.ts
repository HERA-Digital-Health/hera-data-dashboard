import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { API_BASE_URL } from '../config/Constants';
import { type HeraVizData } from '../models/common';
import { formatDate } from '../utils/dateUtil';
import { QuerySpec } from '../models/VizSpec';

type HeraQueryHTTPResponse = {
  [key: string]: unknown;
  data: HeraVizData;
};

function isQueryValid(queryParams: QuerySpec): boolean {
  const { indicator, dateRange } = queryParams;
  return !!indicator && !!dateRange?.from && !!dateRange?.to;
}

function makeQueryKey(queryParams: QuerySpec): Array<string | undefined> {
  const { indicator, dateRange } = queryParams;
  const dateFromStr = dateRange?.from ? formatDate(dateRange?.from) : undefined;
  const dateToStr = dateRange?.to ? formatDate(dateRange?.to) : undefined;
  return [indicator?.name, dateFromStr, dateToStr];
}

export function useHeraQuery(
  queryParams: QuerySpec,
): UseQueryResult<HeraVizData> {
  const { indicator, dateRange } = queryParams;

  return useQuery({
    enabled: isQueryValid(queryParams),
    queryKey: makeQueryKey(queryParams),
    queryFn: async (): Promise<HeraVizData> => {
      if (indicator && dateRange && dateRange.from && dateRange.to) {
        const { endpoint } = indicator;
        const url = new URL(`${API_BASE_URL}/${endpoint}`);

        const params = {
          from: formatDate(dateRange.from),
          to: formatDate(dateRange.to),
        };
        url.search = new URLSearchParams(params).toString();
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const responseJSON: HeraQueryHTTPResponse = await response.json();
        return responseJSON.data;
      }
      throw new Error('Query was run without an indicator');
    },
  });
}
