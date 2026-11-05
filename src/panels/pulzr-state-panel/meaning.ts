import type { BitName, StateColor, StateName } from './pulzr-state-panel-types';

export interface Meaning {
  label: string;
  color?: StateColor;
}

/** What a value means under `states`, or the value itself when nothing names it. */
export function stateOf(value: number, states: StateName[] | undefined): Meaning {
  const named = states?.find((s) => (typeof s.value === 'boolean' ? Number(s.value) === value : s.value === value));
  return named ? { label: named.label, color: named.color } : { label: String(value) };
}

/** The named flags set in a bitmask, lowest bit first. */
export function flagsOf(value: number, bits: BitName[]): Meaning[] {
  return bits
    .filter((b) => Math.floor(value / 2 ** b.bit) % 2 === 1)
    .toSorted((a, b) => a.bit - b.bit)
    .map((b) => ({ label: b.label, color: b.color }));
}
