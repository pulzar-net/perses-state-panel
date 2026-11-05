import type { PanelProps } from '@perses-dev/plugin-system';
import type { TimeSeriesData } from '@perses-dev/spec';

/** A theme color by name, or a hex color. */
export type StateColor = 'success' | 'warning' | 'error' | 'info' | 'primary' | 'neutral' | (string & {});

/** What one value means. `true` and `false` match 1 and 0. */
export interface StateName {
  value: number | boolean;
  label: string;
  color?: StateColor;
}

/** One flag of a bitmask. */
export interface BitName {
  bit: number;
  label: string;
  color?: StateColor;
}

export interface PulzrStatePanelOptions {
  states?: StateName[];
  /** Read each value as a bitmask and show the flags that are set, instead of `states`. */
  bits?: BitName[];
  /** Seconds after which a value is shown as stale. */
  staleAfter?: number;
  /** Display names by series name. */
  labels?: Record<string, string>;
}

export type PulzrStatePanelProps = PanelProps<PulzrStatePanelOptions, TimeSeriesData>;
