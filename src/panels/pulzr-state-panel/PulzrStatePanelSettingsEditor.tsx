import { Button, IconButton, MenuItem, Stack, TextField } from '@mui/material';
import { OptionsEditorColumn, OptionsEditorGrid, OptionsEditorGroup } from '@perses-dev/components';
import type { OptionsEditorProps } from '@perses-dev/plugin-system';
import type { ReactElement } from 'react';

import type { BitName, PulzrStatePanelOptions, StateColor, StateName } from './pulzr-state-panel-types';

const COLORS: StateColor[] = ['neutral', 'success', 'info', 'warning', 'error', 'primary'];

function ColorSelect({ value, onChange }: { value?: StateColor; onChange: (next: StateColor) => void }): ReactElement {
  return (
    <TextField
      select
      size="small"
      label="Color"
      value={value ?? 'neutral'}
      onChange={(e) => onChange(e.target.value)}
      sx={{ width: 120 }}
    >
      {COLORS.map((c) => (
        <MenuItem key={c} value={c}>
          {c}
        </MenuItem>
      ))}
    </TextField>
  );
}

/** `true`, `false` or a number. */
const parseValue = (text: string): number | boolean =>
  text === 'true' || text === 'false' ? text === 'true' : Number(text);

export function PulzrStatePanelSettingsEditor({
  value,
  onChange,
}: OptionsEditorProps<PulzrStatePanelOptions>): ReactElement {
  const states = value.states ?? [];
  const bits = value.bits ?? [];
  const setStates = (next: StateName[]): void => onChange({ ...value, states: next.length ? next : undefined });
  const setBits = (next: BitName[]): void => onChange({ ...value, bits: next.length ? next : undefined });

  return (
    <OptionsEditorGrid>
      <OptionsEditorColumn>
        <OptionsEditorGroup title="States">
          {states.map((s, i) => (
            <Stack key={i} direction="row" spacing={1} alignItems="center">
              <TextField
                size="small"
                label="Value"
                defaultValue={String(s.value)}
                onBlur={(e) => setStates(states.with(i, { ...s, value: parseValue(e.target.value) }))}
                sx={{ width: 90 }}
              />
              <TextField
                size="small"
                label="Label"
                value={s.label}
                onChange={(e) => setStates(states.with(i, { ...s, label: e.target.value }))}
              />
              <ColorSelect value={s.color} onChange={(color) => setStates(states.with(i, { ...s, color }))} />
              <IconButton aria-label="Remove state" onClick={() => setStates(states.filter((_, j) => j !== i))}>
                ×
              </IconButton>
            </Stack>
          ))}
          <Button onClick={() => setStates([...states, { value: states.length, label: '' }])}>Add state</Button>
        </OptionsEditorGroup>
        <OptionsEditorGroup title="Bitmask flags">
          {bits.map((b, i) => (
            <Stack key={i} direction="row" spacing={1} alignItems="center">
              <TextField
                size="small"
                type="number"
                label="Bit"
                value={b.bit}
                onChange={(e) => setBits(bits.with(i, { ...b, bit: Number(e.target.value) }))}
                sx={{ width: 90 }}
              />
              <TextField
                size="small"
                label="Label"
                value={b.label}
                onChange={(e) => setBits(bits.with(i, { ...b, label: e.target.value }))}
              />
              <ColorSelect value={b.color} onChange={(color) => setBits(bits.with(i, { ...b, color }))} />
              <IconButton aria-label="Remove flag" onClick={() => setBits(bits.filter((_, j) => j !== i))}>
                ×
              </IconButton>
            </Stack>
          ))}
          <Button onClick={() => setBits([...bits, { bit: bits.length, label: '' }])}>Add flag</Button>
        </OptionsEditorGroup>
      </OptionsEditorColumn>
      <OptionsEditorColumn>
        <OptionsEditorGroup title="Display">
          <TextField
            size="small"
            type="number"
            label="Stale after (seconds)"
            value={value.staleAfter ?? ''}
            onChange={(e) =>
              onChange({ ...value, staleAfter: e.target.value === '' ? undefined : Number(e.target.value) })
            }
          />
        </OptionsEditorGroup>
      </OptionsEditorColumn>
    </OptionsEditorGrid>
  );
}
