import { Box, Stack, Typography, useTheme } from '@mui/material';
import { useTimeRange } from '@perses-dev/plugin-system';
import { formatDistanceStrict } from 'date-fns';
import type { ReactElement } from 'react';

import { resolveColor } from './color';
import type { Current } from './current';
import { currentOf } from './current';
import type { Meaning } from './meaning';
import { flagsOf, stateOf } from './meaning';
import type { PulzrStatePanelOptions, PulzrStatePanelProps } from './pulzr-state-panel-types';

function Badge({ meaning, large }: { meaning: Meaning; large?: boolean }): ReactElement {
  const theme = useTheme();
  const color = resolveColor(meaning.color, theme);
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        px: large ? 1.5 : 1,
        py: large ? 0.5 : 0.25,
        borderRadius: 1,
        fontWeight: 600,
        fontSize: large ? '1.25rem' : '0.8125rem',
        color,
        bgcolor: `color-mix(in srgb, ${color} 16%, transparent)`,
      }}
    >
      {meaning.label}
    </Box>
  );
}

/** "for 6 hours", or "for at least 1 day" when it held through every reading looked at. */
function held(now: Current, at: number): string | undefined {
  if (now.since === null) return undefined;
  return `for ${now.sinceAtLeast ? 'at least ' : ''}${formatDistanceStrict(now.since, at)}`;
}

function meanings(value: number, spec: PulzrStatePanelOptions): Meaning[] {
  if (spec.bits?.length) {
    const flags = flagsOf(value, spec.bits);
    return flags.length ? flags : [{ label: 'None', color: 'success' }];
  }
  return [stateOf(value, spec.states)];
}

export function PulzrStatePanelComponent({ queryResults, spec }: PulzrStatePanelProps): ReactElement {
  // The dashboard's now, which moves when it refreshes.
  const at = useTimeRange().absoluteTimeRange.end.getTime();
  const rows = queryResults.flatMap((result) => currentOf(result.data));
  const isStale = (now: Current): boolean => spec.staleAfter !== undefined && at - now.time > spec.staleAfter * 1000;

  if (rows.length === 0) {
    return (
      <Stack height="100%" alignItems="center" justifyContent="center">
        <Typography color="text.secondary">No data</Typography>
      </Stack>
    );
  }

  if (rows.length === 1) {
    const now = rows[0]!;
    return (
      <Stack
        height="100%"
        alignItems="flex-start"
        justifyContent="center"
        spacing={1}
        px={2}
        sx={{ opacity: isStale(now) ? 0.5 : 1 }}
      >
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {now.value === null ? null : meanings(now.value, spec).map((m) => <Badge key={m.label} meaning={m} large />)}
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {held(now, at)}
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack height="100%" justifyContent="center" spacing={0.75} px={2} sx={{ overflowY: 'auto' }}>
      {rows.map((now) => (
        <Stack key={now.name} direction="row" alignItems="center" spacing={1} sx={{ opacity: isStale(now) ? 0.5 : 1 }}>
          <Typography variant="body2" sx={{ flex: 1, minWidth: 0 }} noWrap>
            {spec.labels?.[now.name] ?? now.name}
          </Typography>
          {now.value === null ? null : meanings(now.value, spec).map((m) => <Badge key={m.label} meaning={m} />)}
          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 88, textAlign: 'right' }}>
            {held(now, at)}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
