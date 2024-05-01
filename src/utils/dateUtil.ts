import { DateTime } from 'luxon';

const STANDARD_DATE_FORMAT = 'yyyy-MM-dd';

/**
 * Format a JS Date to a YYYY-MM-DD format
 */
export function formatDate(
  date: Date,
  format: string = STANDARD_DATE_FORMAT,
): string {
  const dateTime = DateTime.fromJSDate(date);
  return dateTime.toFormat(format);
}

export function stringToDateTime(
  dateString: string,
  format: string = STANDARD_DATE_FORMAT,
): DateTime {
  return DateTime.fromFormat(dateString, format);
}

export function stringToJSDate(
  dateString: string,
  format: string = STANDARD_DATE_FORMAT,
): Date {
  return stringToDateTime(dateString, format).toJSDate();
}
