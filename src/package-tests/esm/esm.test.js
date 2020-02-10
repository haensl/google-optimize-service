import optimize from 'google-optimize-service';

describe('esm module test', () => {
  let config;
  let store;
  let experiment;

  beforeAll(() => {
    store = {};
    config = {
      autopersist: true,
      key: 'test-app',
      location: {
        search: '?variant=tooltip&utm_expid=1'
      },
      storage: {
        setItem: (key, value) => store[key] = value,
        getItem: (key) => store[key]
      }
    };

    console.info(`Node.js v${process.versions.node}`);
    console.info('configuration', JSON.stringify(config, null, 2));
    optimize.configure(config);
    experiment = optimize.get();
    console.info('experiment', JSON.stringify(experiment, null, 2));
  });

  it('returns an experiment with experimentId', () => {
    expect('experimentId' in experiment).toBe(true);
  });

  it('returns an experiment with variant', () => {
    expect('variant' in experiment).toBe(true);
  });

  it('returns an experiment with experimentId "1"', () => {
    expect(experiment.experimentId).toEqual('1');
  });

  it('returns an experiment with variant "tooltip"', () => {
    expect(experiment.variant).toEqual('tooltip');
  });

  it('persists the experiment to storage', () => {
    expect(store['test-app']).toEqual(
      '{"1":{"experimentId":"1","variant":"tooltip"}}'
    );
  });
});
