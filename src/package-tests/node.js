const assert = require('assert');
const optimize = require('google-optimize-service');
const store = {};

const config = {
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

optimize.configure(config);
const experiment = optimize.get();
console.info(`Node.js v${process.versions.node}`);
console.info('configuration', config);
console.info('experiment', experiment);
assert(
  'experimentId' in experiment,
  'experiment does not contain experimentId!'
);
assert(
  'variant' in experiment,
  'experiment does not contain variant!'
);
assert.equal(
  experiment.experimentId,
  '1',
  `experimentId does not match! Expected: '1'. Actual: ${experiment.experimentId}`
);
assert.equal(
  experiment.variant,
  'tooltip',
  `variant does not match! Expected: 'tooltip'. Actual: ${experiment.variant}`
);
assert.equal(
  store.getItem('test-app'),
  'foo'
);
