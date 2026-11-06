# State panel for Perses

`PulzrStatePanel` shows what a value means now and since when: a controller's mode ("Hold, for 6 hours"), a list of equipment as On and Off, or a bitmask read as the flags that are set ("Door open", "Sensor fault"; "None" when clear).

```yaml
kind: Panel
spec:
  plugin:
    kind: PulzrStatePanel
    spec:
      states:
        - { value: 0, label: Off }
        - { value: 1, label: Auto, color: success }
        - { value: 2, label: Hold, color: warning }
      staleAfter: 900
```

- One series is drawn large; several are a list, one row each, named by `labels` or the series name.
- `states` name values; `true` and `false` match 1 and 0. `bits` reads each value as a bitmask instead.
- Colors are `success`, `warning`, `error`, `info`, `primary`, `neutral` (the dashboard theme's, so light and dark both read) or hex.
- `staleAfter` (seconds) greys a value read longer ago than that.

It works with any time series datasource: the current value is each series' last, and "since" is how far back it runs unchanged. The query runs in instant mode, and a datasource that knows more says so in `metadata.latest` (`{value, time, since, sinceAtLeast}` by series name), which the panel prefers. The [Pulzr Net datasource](https://github.com/pulzar-net/perses-pulzr-datasource) does, looking back past the dashboard's range for when a value began. Series labelled `band` are left out.

## Install

Put the archive (`PulzrStatePanel-<version>.tar.gz`, from the releases) in a folder listed in the Perses server's `plugin.archive_paths`, or `npm install @pulzr/perses-state-panel` to embed it.

## Development

```bash
npm install
npm test
percli plugin test-schemas
npm run build
percli plugin build
```

### Releasing

Set the new version in `package.json`, commit, then tag and push it:

```bash
git tag v0.2.0 && git push origin v0.2.0
```

The Release workflow tests and builds, publishes the package to npm with provenance, and attaches the Perses plugin archive and the npm tarball to a GitHub release.

## License

Apache 2.0
