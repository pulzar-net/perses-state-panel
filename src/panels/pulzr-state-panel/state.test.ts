import type { TimeSeries } from '@perses-dev/spec';

import { currentOf, fromSeries } from './current';
import { flagsOf, stateOf } from './meaning';

const series = (values: Array<[number, number | null]>): TimeSeries => ({ name: 'mode', values });

describe('fromSeries', () => {
  it('finds the last value and how far back it holds, skipping gaps', () => {
    expect(
      fromSeries(
        series([
          [1, 0],
          [2, 2],
          [3, null],
          [4, 2],
          [5, null],
        ]),
      ),
    ).toEqual({
      name: 'mode',
      value: 2,
      time: 4,
      since: 2,
      sinceAtLeast: false,
    });
  });

  it('says at least when the value held through every reading', () => {
    expect(
      fromSeries(
        series([
          [1, 1],
          [2, 1],
        ]),
      )?.sinceAtLeast,
    ).toBe(true);
  });

  it('has nothing without a value', () => {
    expect(fromSeries(series([[1, null]]))).toBeUndefined();
  });
});

describe('currentOf', () => {
  it("prefers the datasource's own word on now, and leaves band edges out", () => {
    const data = {
      series: [
        series([[1, 1]]),
        { name: 'band lo', labels: { band: 'lo' }, values: [[1, 0]] as Array<[number, number]> },
      ],
      metadata: {
        latest: {
          mode: { value: 2, time: '2026-11-05T00:00:00Z', since: '2026-11-04T00:00:00Z', sinceAtLeast: false },
        },
      },
    };
    expect(currentOf(data)).toEqual([
      {
        name: 'mode',
        value: 2,
        time: Date.parse('2026-11-05T00:00:00Z'),
        since: Date.parse('2026-11-04T00:00:00Z'),
        sinceAtLeast: false,
      },
    ]);
  });
});

describe('meanings', () => {
  it('names a value, and matches true and false to 1 and 0', () => {
    const states = [
      { value: 2, label: 'Hold' },
      { value: true, label: 'On' },
    ];
    expect(stateOf(2, states).label).toBe('Hold');
    expect(stateOf(1, states).label).toBe('On');
    expect(stateOf(7, states).label).toBe('7');
  });

  it('reads the set flags of a bitmask', () => {
    const bits = [
      { bit: 3, label: 'Fault' },
      { bit: 0, label: 'Door' },
      { bit: 1, label: 'Low' },
    ];
    expect(flagsOf(9, bits).map((f) => f.label)).toEqual(['Door', 'Fault']);
    expect(flagsOf(0, bits)).toEqual([]);
  });
});
