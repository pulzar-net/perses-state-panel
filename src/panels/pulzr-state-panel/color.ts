import type { Theme } from '@mui/material';

import type { StateColor } from './pulzr-state-panel-types';

const NAMED = ['success', 'warning', 'error', 'info', 'primary'] as const;

/** A named color from the dashboard's theme, so states read right in light and dark; hex as given. */
export function resolveColor(color: StateColor | undefined, theme: Theme): string {
  if (color === undefined || color === 'neutral') return theme.palette.text.secondary;
  if ((NAMED as readonly string[]).includes(color)) return theme.palette[color as (typeof NAMED)[number]].main;
  return color;
}
