import * as R from 'remeda';
import { formatDate } from './dateUtil';

// we include `undefined` here even though they technically aren't valid
// JSON values and will get dropped
type JSONPrimitive = string | number | boolean | null | undefined;

type JSONValue =
  | JSONPrimitive
  | JSONValue[]
  | {
      [key: string]: JSONValue;
    };

type NotAssignableToJSON = bigint | symbol | ((...args: unknown[]) => unknown);

/**
 * Recursively go through a type and make it JSON-compatible
 */
export type ToJSON<T> = unknown extends T
  ? never
  : {
      [P in keyof T]: Date extends T[P]
        ? string
        : T[P] extends JSONValue
        ? T[P]
        : T[P] extends NotAssignableToJSON
        ? never
        : ToJSON<T[P]>;
    };

/**
 * Convert a value into a JSON-compatible object, for example by recursively
 * converting any `Date` instances into strings.
 */
export function toJSON<T>(
  val: T,
  options = {
    dateFormatter: formatDate,
  },
): ToJSON<T> {
  // handle JSON primitives
  if (
    val === undefined ||
    val === null ||
    typeof val === 'string' ||
    typeof val === 'boolean' ||
    typeof val === 'number'
  ) {
    // @ts-expect-error this is safe
    return val;
  }

  if (val instanceof Date) {
    // @ts-expect-error this is safe
    return options.dateFormatter(val);
  }

  if (Array.isArray(val)) {
    // @ts-expect-error this is safe
    return val.map((v) => toJSON(v, options));
  }

  if (typeof val === 'object') {
    // @ts-expect-error this is safe
    return R.mapValues(val, (v) => toJSON(v, options));
  }

  throw Error('Unprocessable value encountered in toJSON');
  console.log('Unprocessable value', val);
}
