import type { PanelPlugin } from '@perses-dev/plugin-system';

import type { PulzrStatePanelOptions, PulzrStatePanelProps } from './pulzr-state-panel-types';
import { PulzrStatePanelComponent } from './PulzrStatePanelComponent';
import { PulzrStatePanelSettingsEditor } from './PulzrStatePanelSettingsEditor';

export const PulzrStatePanel: PanelPlugin<PulzrStatePanelOptions, PulzrStatePanelProps> = {
  PanelComponent: PulzrStatePanelComponent,
  panelOptionsEditorComponents: [{ label: 'States', content: PulzrStatePanelSettingsEditor }],
  supportedQueryTypes: ['TimeSeriesQuery'],
  // Instant: a datasource that can tell when a value began does so.
  queryOptions: { mode: 'instant' },
  createInitialOptions: () => ({}),
};
