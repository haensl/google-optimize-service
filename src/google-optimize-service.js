import querystring from 'querystring';

export const storagePreferences = {
  localStorage: 'local',
  sessionStorage: 'session'
};

const config = {
  autopersist: true,
  fields: [
    'variant'
  ],
  key: 'optimize',
  location: {
    search: ''
  },
  storage: null,
  storagePreference: storagePreferences.localStorage
};

export const fields = (newFields) => {
  if (Array.isArray(newFields)
    && newFields.reduce((isString, val) =>
      isString && typeof val === 'string', true)) {
    config.fields = newFields.slice();
  } else if (newFields) {
    throw new TypeError('Invalid parameter. Expected newFields to be Array of strings.');
  }

  return config.fields.slice();
};

export const autopersist = (shouldAutopersist) => {
  if (typeof shouldAutopersist === 'boolean') {
    config.autopersist = shouldAutopersist;
  } else if (typeof shouldAutopersist !== 'undefined') {
    throw new TypeError('Invalid parameter. Expected shouldAutopersist to be boolean.');
  }

  return config.autopersist;
};

export const key = (newKey) => {
  if (typeof newKey === 'string') {
    config.key = newKey;
  } else if (newKey) {
    throw new TypeError('Invalid parameter. Expected newKey to be string');
  }

  return config.key;
};

export const location = (newLocation) => {
  if (newLocation) {
    if ('search' in newLocation
      && typeof newLocation.search === 'string') {
      config.location = newLocation;
    } else {
      throw new TypeError('Invalid parameter. Expected newLocation to be object with string property "serach".');
    }
  }

  return {
    search: config.location.search
  };
};

export const storage = (newStorage) => {
  if (newStorage) {
    if (typeof newStorage !== 'object') {
      throw new TypeError('Invalid parameter. Expected storage to be object.');
    }

    ['getItem', 'setItem'].forEach((requiredFunction) => {
      if (typeof newStorage[requiredFunction] !== 'function') {
        throw new TypeError(`Invalid parameter. Expected storage to implement function ${requiredFunction}.`);
      }
    });

    config.storage = newStorage;
  }

  return Object.assign({}, config.storage);
};

export const storagePreference = (newStoragePreference) => {
  if (newStoragePreference) {
    if (!Object.values(storagePreferences)
    .includes(newStoragePreference)) {
      throw new TypeError(`Invalid parameter. Expected newStoragePreference to be on of ${Object.values(storagePreferences).join(', ')}.`);
    }

    config.storagePreference = newStoragePreference;
  }

  return config.storagePreference;
};

export const configure = (opts) => {
  if (typeof opts !== 'object') {
    throw new TypeError('Invalid parameter. Expected opts to be object.');
  }

  Object.keys(config)
    .forEach((option) => {
      if (option in opts) {
        try {
          switch (option) {
            case 'autopersist':
              autopersist(opts.autopersist);
              break;
            case 'key':
              key(opts.key);
              break;
            case 'location':
              location(opts.location);
              break;
            case 'storage':
              storage(opts.storage);
              break;
            case 'storagePreference':
              storagePreference(opts.storagePreference);
              break;
            case 'fields':
              fields(opts.fields);
              break;
            default:
              break;
          }
        } catch (e) {
          throw new TypeError(`Invalid option: ${option}.`, e.message);
        }
      }
    });
};

export const fromQuery = () => {
  const experiment = {};

  if (config.location) {
    const query = querystring.parse(
      config.location.search.replace(/^\?/, '')
    );

    if ('utm_expid' in query) {
      experiment.experimentId = query.utm_expid;
    }

    if ('utm_referrer' in query) {
      experiment.referrer = query.utm_referrer;
    }

    (config.fields || []).forEach((field) => {
      if (field in query) {
        experiment[field] = query[field];
      }
    });
  }

  if (Object.keys(experiment).length) {
    return experiment;
  }

  return null;
};

const fromStorage = () => {
  if (config.storage) {
    const experimentsFromStorage = config.storage.getItem(config.key);
    if (experimentsFromStorage) {
      return JSON.parse(experimentsFromStorage);
    }
  }

  return null;
};

export const persist = (experiments = get()) => {
  if (config.storage) {
    config.storage.setItem(
      config.key,
      JSON.stringify(experiments)
    );
  }
};

export const currentExperimentId = () => {
  if (config.location) {
    const experimentInQuery = fromQuery();
    if (experimentInQuery) {
      return experimentInQuery.experimentId;
    }
  }
};

export const get = (experimentId = currentExperimentId()) => {
  const experimentsFromStorage = fromStorage();
  const experimentInQuery = fromQuery();
  const experiments = experimentsFromStorage || {};

  if (experimentInQuery
    && !(experimentInQuery.experimentId in experiments)) {
    experiments[experimentInQuery.experimentId] = experimentInQuery;
  }

  if (config.autopersist) {
    persist(experiments);
  }

  if (experimentId) {
    if (experimentId in experiments) {
      return experiments[experimentId];
    }

    return null;
  }

  if (Object.keys(experiments).length) {
    return experiments;
  }

  return null;
};

export const preventFlicker = (timeout = 2000, intervalMs = 10) => {
  document.documentElement.classList.add('wait-for-optimize');
  let dt = 0;
  const interval = window.setInterval(() => {
    if ((window.ga && window.ga.loaded) || dt >= timeout) {
      document.documentElement.classList.remove('wait-for-optimize');
      window.clearInterval(interval);
    }
    dt += intervalMs;
  }, intervalMs);
};

export const discover = () => {
  if (typeof window !== 'undefined') {
    const opts = {};
    if ('localStorage' in window) {
      if ('sessionStorage' in window
        && config.storagePreference === storagePreferences.sessionStorage) {
        opts.storage = window.sessionStorage;
      } else {
        opts.storage = window.localStorage;
      }
    } else if ('sessionStorage' in window) {
      opts.storage = window.sessionStorage;
    }

    if ('location' in window
      && 'search' in window.location) {
      opts.location = window.location;
    }

    if (Object.keys(opts).length) {
      configure(opts);
    }
  }
};

export default (() => {
  discover();
  return {
    autopersist,
    configure,
    currentExperimentId,
    discover,
    fields,
    fromQuery,
    get,
    key,
    location,
    persist,
    preventFlicker,
    storage,
    storagePreference,
    storagePreferences
  };
})();
