import querystring from 'querystring';

const config = {
  key: 'optimize',
  location: {
    search: ''
  },
  storage: null
};

export const key = (newKey) => {
  if (typeof newKey === 'string') {
    config.key = newKey;
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

export const configure = (opts) => {
  if (typeof opts !== 'object') {
    throw new TypeError('Invalid parameter. Expected opts to be object.');
  }

  if ('key' in opts) {
    if (typeof opts.key !== 'string') {
      throw new TypeError('Invalid option. Expected key to be string.');
    }

    key(opts.key);
  }

  if ('location' in opts) {
    if (typeof opts.location !== 'object') {
      throw new TypeError('Invalid option. Expected search to be object.');
    }

    location(opts.location);
  }

  if ('storage' in opts) {
    if (typeof opts.storage !== 'object') {
      throw new TypeError('Invalid option. Expected storage to be object.');
    }

    ['getItem', 'setItem'].forEach((requiredFunction) => {
      if (typeof opts.storage[requiredFunction] !== 'function') {
        throw new TypeError(`Invalid option. Expected storage to implement function ${requiredFunction}.`);
      }
    });

    config.storage = opts.storage;
  }
};

export const get = (experimentId) => {
  const state = {};
  if (typeof window !== 'undefined') {
    if ('localStorage' in window) {
      let experimentId = '';

      if ('location' in window
        && 'search' in window.location) {
        const query = querystring.parse(
          window.location.search.replace(/^\?/, '')
        );

        if ('utm_expid' in query) {
          experimentId = query.utm_expid;
        }
      }

      const fromLocalStorage = window.localStorage
        .getItem(`${LOCAL_STORAGE_KEY}:${experimentId}`);

      if (fromLocalStorage) {
        return JSON.parse(fromLocalStorage);
      }
    }

    if ('location' in window
      && 'search' in window.location) {
      const query = querystring.parse(
        window.location.search.replace(/^\?/, '')
      );

      if ('variant' in query) {
        state.variant = query.variant;
      }

      if ('utm_expid' in query) {
        state.experimentId = query.utm_expid;
      }

      if ('utm_referrer' in query) {
        state.referrer = query.utm_referrer;
      }

      if ('localStorage' in window) {
        if (Object.keys(state).length) {
          window.localStorage.setItem(`${LOCAL_STORAGE_KEY}:${state.experimentId || ''}`, JSON.stringify(state));
        }
      }
    }
  }

  if (Object.keys(state).length) {
    return state;
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
      opts.storage = window.localStorage;
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
    configure,
    discover,
    get,
    key,
    location,
    preventFlicker
  };
})();
