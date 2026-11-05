import type { TimeSeries, TimeSeriesData } from '@perses-dev/spec';

/** A series as it is now: its last value, when that was read, and since when it has held. */
export interface Current {
  name: string;
  value: number | null;
  time: number;
  since: number | null;
  /** The value held through every reading looked at, so it began before them. */
  sinceAtLeast: boolean;
}

/** What a datasource may say about now, keyed by series name, in `metadata.latest`. */
interface LatestMetadata {
  value: number | null;
  time: string;
  since: string | null;
  sinceAtLeast: boolean;
}

/** From the series alone: the last non-null value, and how far back it runs unchanged. */
export function fromSeries(series: TimeSeries): Current | undefined {
  const values = series.values;
  let last = values.length - 1;
  while (last >= 0 && values[last]![1] === null) last -= 1;
  if (last < 0) return undefined;
  const [time, value] = values[last]!;
  let first = last;
  while (first > 0 && (values[first - 1]![1] === value || values[first - 1]![1] === null)) first -= 1;
  return { name: series.name, value, time, since: values[first]![0], sinceAtLeast: first === 0 };
}

/**
 * Every series' current state. A datasource that knows better than the range
 * it returned (the Pulzr Net datasource looks back further for when a value
 * began) says so in `metadata.latest`, and that wins.
 */
export function currentOf(data: TimeSeriesData): Current[] {
  const latest = (data.metadata?.latest ?? {}) as Record<string, LatestMetadata>;
  return data.series.flatMap((series): Current[] => {
    if (series.labels?.band) return [];
    const known = latest[series.name];
    if (known && known.value !== null) {
      return [
        {
          name: series.name,
          value: known.value,
          time: Date.parse(known.time),
          since: known.since ? Date.parse(known.since) : null,
          sinceAtLeast: known.sinceAtLeast,
        },
      ];
    }
    const now = fromSeries(series);
    return now ? [now] : [];
  });
}
