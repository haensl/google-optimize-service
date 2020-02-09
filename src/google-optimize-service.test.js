import optimize from './google-optimize-service';

const mockLocation = (location = {
  search: '?variant=tooltip&utm_expid=1'
}) => {
  const originalLocation = window.location;
  delete window.location;
  window.location = location;
  return {
    restore: () => {
      window.location = originalLocation;
    },
    mock: location
  };
};

const mockLocalStorage = (storage = {
  getItem: jest.fn(),
  setItem: jest.fn()
}) => {
  const originalLocalStorage = window.localStorage;
  Object.defineProperty(window, 'localStorage', {
    value: storage
  });
  return {
    restore: () => {
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage
      });
    },
    mock: storage
  };
};

const mockSessionStorage = (storage = {
  getItem: jest.fn(),
  setItem: jest.fn()
}) => {
  const originalSessionStorage = window.sessionStorage;
  Object.defineProperty(window, 'sessionStorage', {
    value: storage
  });
  return {
    restore: () => {
      Object.defineProperty(window, 'sessionStorage', {
        value: originalSessionStorage
      });
    },
    mock: storage
  };
};

describe('google-optimize-service', () => {
  describe('autopersist()', () => {
    beforeEach(() => {
      jest.resetModules();
    });

    it('returns the default autopersist setting', () => {
      expect(optimize.autopersist()).toBe(true);
    });

    describe('called with argument', () => {
      describe('boolean', () => {
        it('sets and returns the autopersist setting', () => {
          expect(optimize.autopersist(false)).toBe(false);
        });
      });

      describe('string', () => {
        it('throws a TypeError', () => {
          expect(optimize.autopersist.bind(optimize, 'foo'))
            .toThrow(TypeError);
        });
      });

      describe('number', () => {
        it('throws a TypeError', () => {
          expect(optimize.autopersist.bind(optimize, 69))
            .toThrow(TypeError);
        });
      });

      describe('object', () => {
        it('throws a TypeError', () => {
          expect(optimize.autopersist.bind(optimize, {}))
            .toThrow(TypeError);
        });
      });

      describe('function', () => {
        it('throws a TypeError', () => {
          expect(optimize.autopersist.bind(optimize, jest.fn()))
            .toThrow(TypeError);
        });
      });
    });
  });

  describe('key()', () => {
    beforeEach(() => {
      jest.resetModules();
    });

    it('returns the default key', () => {
      expect(optimize.key()).toEqual('optimize');
    });

    describe('called with argument', () => {
      describe('string', () => {
        let _key;

        beforeEach(() => {
          _key = optimize.key();
          optimize.key('foo');
        });

        afterEach(() => {
          optimize.key(_key);
        });

        it('sets and returns the new key', () => {
          expect(optimize.key()).toEqual('foo');
        });
      });

      describe('object', () => {
        it('throws a TypeError', () => {
          expect(optimize.key.bind(optimize, {})).toThrow(TypeError);
        });
      });

      describe('number', () => {
        it('throws a TypeError', () => {
          expect(optimize.key.bind(optimize, 69)).toThrow(TypeError);
        });
      });

      describe('boolean', () => {
        it('throws a TypeError', () => {
          expect(optimize.key.bind(optimize, true)).toThrow(TypeError);
        });
      });

      describe('function', () => {
        it('throws a TypeError', () => {
          expect(optimize.key.bind(optimize, jest.fn())).toThrow(TypeError);
        });
      });
    });
  });

  describe('location()', () => {
    describe('called without parameter', () => {
      beforeEach(() => {
        jest.resetModules();
      });

      it('returns the default location', () => {
        expect(optimize.location()).toHaveProperty('search', '');
      });

      describe('and there is a window object', () => {
        let locationMock;
        beforeAll(() => {
          locationMock = mockLocation();
        });

        afterAll(() => {
          locationMock.restore();
        });

        describe('with a location', () => {
          beforeEach(() => {
            optimize.discover();
          });

          it('returns the window.location.search object', () => {
            expect(optimize.location()).toHaveProperty('search', '?variant=tooltip&utm_expid=1');
          });

          describe('and window.location changes', () => {
            beforeEach(() => {
              window.location.search = '?variant=cursor&utm_expid=2';
              expect(optimize.location()).toHaveProperty('search', '?variant=cursor&utm_expid=2');
            });
          });
        });
      });
    });

    describe('called with parameter', () => {
      describe('object with string property search', () => {
        let newLocation;
        beforeEach(() => {
          newLocation = optimize.location({
            search: '?foo=bar'
          });
        });

        it('sets and returns the new location', () => {
          expect(newLocation).toHaveProperty('search', '?foo=bar');
        });
      });

      describe('string', () => {
        it('throws a TypeError', () => {
          expect(optimize.location.bind(optimize, 'foo')).toThrow(TypeError);
        });
      });

      describe('boolean', () => {
        it('throws a TypeError', () => {
          expect(optimize.location.bind(optimize, true)).toThrow(TypeError);
        });
      });

      describe('number', () => {
        it('throws a TypeError', () => {
          expect(optimize.location.bind(optimize, 69)).toThrow(TypeError);
        });
      });

      describe('object without property search', () => {
        it('throws a TypeError', () => {
          expect(optimize.location.bind(optimize, {
            foo: 'bar'
          })).toThrow(TypeError);
        });
      });

      describe('object with non-string property search', () => {
        it('throws a TypeError', () => {
          expect(optimize.location.bind(optimize, {
            search: jest.fn()
          })).toThrow(TypeError);
        });
      });
    });
  });

  describe('storage()', () => {
    beforeEach(() => {
      jest.resetModules();
    });

    describe('called without parameter', () => {
      it('does not throw', () => {
        expect(optimize.storage).not.toThrow();
      });

      it('returns the default storage', () => {
        expect(optimize.storage()).toBeDefined();
      });

      describe('and there is a window object', () => {
        let localStorageMock;
        beforeAll(() => {
          localStorageMock = mockLocalStorage();
        });

        afterAll(() => {
          localStorageMock.restore();
        });

        describe('with a localStorage', () => {
          beforeEach(() => {
            optimize.discover();
          });

          it('returns the window.localStorage object', () => {
            expect(optimize.storage()).toHaveProperty('setItem', localStorageMock.mock.setItem);
          });

          describe('and window.location changes', () => {
            beforeEach(() => {
              window.location.search = '?variant=cursor&utm_expid=2';
              expect(optimize.location()).toHaveProperty('search', '?variant=cursor&utm_expid=2');
            });
          });
        });
      });
    });

    describe('called with parameter', () => {
      beforeEach(() => {
        jest.resetModules();
      });

      describe('object with required functions setItem() and getItem()', () => {
        let mockStore;

        beforeEach(() => {
          mockStore = {
            getItem: jest.fn(),
            setItem: jest.fn()
          };
        });

        it('sets and returns the given store', () => {
          expect(optimize.storage(mockStore)).toEqual(mockStore);
        });
      });

      describe('string', () => {
        it('throws a TypeError', () => {
          expect(optimize.storage.bind(optimize, 'foo')).toThrow(TypeError);
        });
      });

      describe('number', () => {
        it('throws a TypeError', () => {
          expect(optimize.storage.bind(optimize, 69)).toThrow(TypeError);
        });
      });

      describe('boolean', () => {
        it('throws a TypeError', () => {
          expect(optimize.storage.bind(optimize, true)).toThrow(TypeError);
        });
      });

      describe('function', () => {
        it('throws a TypeError', () => {
          expect(optimize.storage.bind(optimize, jest.fn())).toThrow(TypeError);
        });
      });

      describe('object without required functions getItem() and setItem()', () => {
        it('throws a TypeError', () => {
          expect(optimize.storage.bind(optimize, {
            foo: 'bar'
          })).toThrow(TypeError);
        });
      });

      describe('object with required function properties getItem and setItem not being functions', () => {
        it('throws a TypeError', () => {
          expect(optimize.storage.bind(optimize, {
            setItem: 'bar',
            getItem: 69
          })).toThrow(TypeError);
        });
      });
    });
  });

  describe('storagePreference()', () => {
    describe('called without parameter', () => {
      it('retuns the default storage preference', () => {
        expect(optimize.storagePreference()).toEqual(optimize.storagePreferences.localStorage);
      });
    });

    describe('called with valid storage preference', () => {
      it('sets and returns the storage preference', () => {
        expect(optimize.storagePreference(optimize.storagePreferences.sessionStorage)).toEqual(optimize.storagePreferences.sessionStorage);
      });
    });

    describe('unknown storage preference', () => {
      it('throws a TypeError', () => {
        expect(optimize.storagePreference.bind(optimize, 'foo')).toThrow(TypeError);
      });
    });

    describe('number', () => {
      it('throws a TypeError', () => {
        expect(optimize.storagePreference.bind(optimize, 69)).toThrow(TypeError);
      });
    });

    describe('boolean', () => {
      it('throws a TypeError', () => {
        expect(optimize.storagePreference.bind(optimize, true)).toThrow(TypeError);
      });
    });

    describe('object', () => {
      it('throws a TypeError', () => {
        expect(optimize.storagePreference.bind(optimize, {
          foo: 'bar'
        })).toThrow(TypeError);
      });
    });

    describe('function', () => {
      it('throws a TypeError', () => {
        expect(optimize.storagePreference.bind(optimize, jest.fn())).toThrow(TypeError);
      });
    });
  });

  describe('configure()', () => {
    describe('called without parameter', () => {
      it('throws a TypeError', () => {
        expect(optimize.configure).toThrow(TypeError);
      });
    });

    describe('called with autopersist option', () => {
      describe('valid autopersist setting', () => {
        beforeEach(() => {
          optimize.configure({
            autopersist: false
          });
        });

        it('sets the autopersist setting', () => {
          expect(optimize.autopersist()).toBe(false);
        });
      });

      describe('invalid autopersist setting', () => {
        it('throws a TypeError', () => {
          expect(optimize.configure.bind(optimize, {
            autopersist: 69
          })).toThrow(TypeError);
        });
      });
    });

    describe('called with key option', () => {
      describe('valid key', () => {
        let _key;

        beforeEach(() => {
          _key = optimize.key();
          optimize.configure({
            key: 'foo'
          });
        });

        afterEach(() => {
          optimize.key(_key);
        });

        it('sets the key', () => {
          expect(optimize.key()).toEqual('foo');
        });
      });

      describe('invalid key', () => {
        it('throws a TypeError', () => {
          expect(optimize.configure.bind(optimize, {
            key: 123
          })).toThrow(TypeError);
        });
      });
    });

    describe('called with location option', () => {
      describe('valid location', () => {
        let location;

        beforeEach(() => {
          location = {
            search: '?foo=bar'
          };
          optimize.configure({
            location
          });
        });

        it('sets the location', () => {
          expect(optimize.location()).toEqual(location);
        });
      });

      describe('invalid location', () => {
        it('throws a TypeError', () => {
          expect(optimize.configure.bind(optimize, {
            location: 69
          })).toThrow(TypeError);
        });
      });
    });

    describe('called with storage option', () => {
      describe('valid storage', () => {
        let storage;

        beforeEach(() => {
          storage = {
            setItem: jest.fn(),
            getItem: jest.fn()
          };

          optimize.configure({
            storage
          });
        });

        it('sets the storage', () => {
          expect(optimize.storage()).toEqual(storage);
        });
      });

      describe('invalid storage', () => {
        it('throws a TypeError', () => {
          expect(optimize.configure.bind(optimize, {
            storage: 69
          })).toThrow(TypeError);
        });
      });
    });

    describe('called with storagePreference option', () => {
      describe('valid storagePreference', () => {
        beforeEach(() => {
          optimize.configure({
            storagePreference: optimize.storagePreferences.sessionStorage
          });
        });

        it('sets the storagePreference', () => {
          expect(optimize.storagePreference()).toEqual(optimize.storagePreferences.sessionStorage);
        });
      });

      describe('invalid storagePreference', () => {
        it('throws a TypeError', () => {
          expect(optimize.configure.bind(optimize, {
            storagePreference: 'foo'
          })).toThrow(TypeError);
        });
      });
    });
  });

  describe('preventFlicker()', () => {
    beforeAll(() => {
      jest.useFakeTimers();
      optimize.preventFlicker();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    describe('before google analytics is available', () => {
      it('adds the wait-for-optimize class to the document element', () => {
        expect(document.documentElement.classList.contains('wait-for-optimize'))
          .toBe(true);
      });
    });

    describe('after google analytics has become available', () => {
      beforeEach(() => {
        window.ga = {
          loaded: true
        };
        jest.runOnlyPendingTimers();
      });

      it('removes the wait-for-optimize class from the document element', () => {
        expect(document.documentElement.classList.contains('wait-for-optimize'))
          .toBe(false);
      });
    });
  });

  describe('discover()', () => {
    describe('when there is a window object', () => {
      describe('with location', () => {
        describe('with search', () => {
          let locationMock;

          beforeEach(() => {
            locationMock = mockLocation();
            optimize.discover();
          });

          afterEach(() => {
            locationMock.restore();
          });

          it('discovers location as location engine', () => {
            expect(optimize.location()).toEqual(locationMock.mock);
          });
        });
      });

      describe('with session storage', () => {
        let localStorageMock;
        let sessionStorageMock;

        beforeEach(() => {
          localStorageMock = mockLocalStorage(null);
          sessionStorageMock = mockSessionStorage();
          jest.resetModules();
          optimize.discover();
        });

        afterEach(() => {
          localStorageMock.restore();
          sessionStorageMock.restore();
        });

        it('discovers session storage as storageEngine', () => {
          expect(optimize.storage()).toEqual(sessionStorageMock.mock);
        });
      });

      describe('with local storage', () => {
        let localStorageMock;

        beforeEach(() => {
          localStorageMock = mockLocalStorage();
        });

        afterEach(() => {
          localStorageMock.restore();
        });

        describe('with storagePreference set to localStorage', () => {
          beforeEach(() => {
            optimize.storagePreference(optimize.storagePreferences.local);
            optimize.discover();
          });

          it('discovers local storage as storage engine', () => {
            expect(optimize.storage()).toBeDefined();
          });
        });

        describe('and session storage', () => {
          describe('with storagePreference set to localStorage', () => {
            beforeEach(() => {
              optimize.storagePreference(optimize.storagePreferences.local);
              optimize.discover();
            });

            it('discovers local storage as storage engine', () => {
              expect(optimize.storage()).toBeDefined();
            });
          });

          describe('with storagePreference set to sessionStorage', () => {
            let sessionStorageMock;
            beforeEach(() => {
              sessionStorageMock = mockSessionStorage();
              optimize.storagePreference(optimize.storagePreferences.session);
              optimize.discover();
            });

            afterEach(() => {
              sessionStorageMock.restore();
            });

            it('discovers session storage as storage engine', () => {
              expect(optimize.storage()).toBeDefined();
            });

            it('does not choose local storage as storage engine', () => {
              expect(optimize.storage()).not.toEqual(localStorageMock.mock);
            });
          });
        });
      });
    });
  });

  describe('get()', () => {
    describe('called without parameter', () => {
      let experiments;
      let experiment;
      let localStorageMock;
      let mockExperiments;
      let locationMock;

      beforeEach(() => {
        localStorageMock = mockLocalStorage();
        mockExperiments = {
          1: {
            variant: 'tooltip',
            experimentId: 1,
            referrer: ''
          }
        };
        localStorageMock.mock.getItem.mockReturnValueOnce(JSON.stringify(mockExperiments));
        optimize.storage(localStorageMock.mock);
      });

      afterEach(() => {
        localStorageMock.restore();
      });

      describe('with experiment in query', () => {
        beforeEach(() => {
          locationMock = mockLocation();
          optimize.location(locationMock.mock);
          experiment = optimize.get();
        });

        afterEach(() => {
          locationMock.restore();
        });

        it('returns the experiment in the query from storage', () => {
          expect(experiment).toEqual(mockExperiments[1]);
        });

        describe('and experiment in query is not in storage', () => {
          beforeEach(() => {
            locationMock = mockLocation({
              search: '?variant=Doggy&utm_expid=69'
            });
            optimize.location(locationMock.mock);
            experiment = optimize.get();
          });

          afterEach(() => {
            locationMock.restore();
          });

          it('returns the experiment from the query', () => {
            expect(experiment).toEqual(expect.objectContaining({
              variant: 'Doggy',
              experimentId: '69'
            }));
          });

          describe('and autopersist is turned on', () => {
            beforeEach(() => {
              localStorageMock.mock.getItem.mockReset();
              localStorageMock.mock.setItem.mockReset();
              optimize.autopersist(true);
              experiment = optimize.get();
            });

            it('persists the experiments to storage', () => {
              expect(localStorageMock.mock.setItem).toHaveBeenCalled();
            });
          });

          describe('and autopersist is turned off', () => {
            beforeEach(() => {
              localStorageMock.mock.getItem.mockReset();
              localStorageMock.mock.setItem.mockReset();
              optimize.autopersist(false);
              experiment = optimize.get();
            });

            it('does not persist to storage', () => {
              expect(localStorageMock.mock.setItem).not.toHaveBeenCalled();
            });
          });
        });
      });

      describe('without experiment in query', () => {
        beforeEach(() => {
          locationMock = mockLocation({ search: '' });
          optimize.location(locationMock.mock);
          experiments = optimize.get();
        });

        afterEach(() => {
          locationMock.restore();
        });

        it('returns a map of all experiments in storage', () => {
          expect(experiments).toEqual(mockExperiments);
        });
      });
    });

    describe('called with experimentId', () => {
      let locationMock;
      let localStorageMock;
      let experiment;

      beforeEach(() => {
        localStorageMock = mockLocalStorage();
        localStorageMock.mock.getItem.mockReturnValueOnce(
          JSON.stringify({
            1: {
              variant: 'tooltip',
              experimentId: '1'
            }
          })
        );
        optimize.storage(localStorageMock.mock);
      });

      afterEach(() => {
        localStorageMock.restore();
      });

      describe('existing experiment', () => {
        describe('only in query', () => {
          beforeEach(() => {
            locationMock = mockLocation({
              search: '?variant=doggy&utm_expid=69'
            });
            optimize.location(locationMock.mock);
          });

          afterEach(() => {
            locationMock.restore();
          });

          describe('with autopersist turned on', () => {
            beforeEach(() => {
              localStorageMock.mock.setItem.mockReset();
              optimize.autopersist(true);
              experiment = optimize.get('69');
            });

            it('returns the experiment from the query', () => {
              expect(experiment).toEqual(expect.objectContaining({
                experimentId: '69',
                variant: 'doggy'
              }));
            });

            it('persists the experiments to storage', () => {
              expect(localStorageMock.mock.setItem)
                .toHaveBeenCalledWith(
                  'optimize',
                  '{"1":{"variant":"tooltip","experimentId":"1"},"69":{"variant":"doggy","experimentId":"69"}}'
                );
            });
          });

          describe('with autopersist turned off', () => {
            beforeEach(() => {
              localStorageMock.mock.setItem.mockReset();
              optimize.autopersist(false);
              experiment = optimize.get('69');
            });

            it('returns the experiment from the query', () => {
              expect(experiment).toEqual(expect.objectContaining({
                experimentId: '69',
                variant: 'doggy'
              }));
            });

            it('does not persist the experiments to storage', () => {
              expect(localStorageMock.mock.setItem)
                .not
                .toHaveBeenCalled();
            });
          });
        });

        describe('only in storage', () => {
          beforeEach(() => {
            locationMock = mockLocation({
              search: ''
            });
            optimize.location(locationMock.mock);
            experiment = optimize.get('1');
          });

          afterEach(() => {
            locationMock.restore();
          });

          it('returns the experiment from storage', () => {
            expect(experiment).toEqual(expect.objectContaining({
              variant: 'tooltip',
              experimentId: '1'
            }));
          });
        });
      });

      describe('non-existing experimentId', () => {
        beforeEach(() => {
          locationMock = mockLocation({
            search: ''
          });
          optimize.location(locationMock.mock);
          experiment = optimize.get('69');
        });

        afterEach(() => {
          locationMock.restore();
        });

        it('returns null', () => {
          expect(experiment).toBeNull();
        });
      });
    });
  });

  describe('currentExperimentId()', () => {
    let experimentId;

    describe('with location', () => {
      let locationMock;

      describe('containing an experiment', () => {
        beforeEach(() => {
          locationMock = mockLocation();
          optimize.location(locationMock.mock);
          experimentId = optimize.currentExperimentId();
        });

        afterEach(() => {
          locationMock.restore();
        });

        it('returns the utm experiment id from the query', () => {
          expect(experimentId).toEqual('1');
        });
      });

      describe('not containing an experiment', () => {
        beforeEach(() => {
          locationMock = mockLocation({
            search: ''
          });
          optimize.location(locationMock.mock);
          experimentId = optimize.currentExperimentId();
        });

        afterEach(() => {
          locationMock.restore();
        });

        it('returns undefined', () => {
          expect(experimentId).not.toBeDefined();
        });
      });
    });

    describe('without location', () => {
      it('returns undefined', () => {
        expect(optimize.currentExperimentId()).not.toBeDefined();
      });
    });
  });

  describe('fromQuery()', () => {
    let experiment;

    describe('with location', () => {
      let locationMock;

      describe('with experiment', () => {
        beforeEach(() => {
          locationMock = mockLocation();
          optimize.location(locationMock.mock);
          experiment = optimize.fromQuery();
        });

        afterEach(() => {
          locationMock.restore();
        });

        it('returns the experiment from query', () => {
          expect(experiment).toEqual(expect.objectContaining({
            variant: 'tooltip',
            experimentId: '1'
          }));
        });
      });

      describe('without experiment', () => {
        beforeEach(() => {
          locationMock = mockLocation({
            search: ''
          });
          optimize.location(locationMock.mock);
          experiment = optimize.fromQuery();
        });

        afterEach(() => {
          locationMock.restore();
        });

        it('returns null', () => {
          expect(experiment).toBeNull();
        });
      });
    });

    describe('without location', () => {
      it('returns null', () => {
        expect(optimize.fromQuery()).toBeNull();
      });
    });
  });

  describe('persist()', () => {
    let localStorageMock;
    let locationMock;

    beforeEach(() => {
      localStorageMock = mockLocalStorage();
      locationMock = mockLocation();
      optimize.storage(localStorageMock.mock);
      optimize.location(locationMock.mock);
    });

    afterEach(() => {
      localStorageMock.restore();
      locationMock.restore();
    });

    describe('called without parameters', () => {
      beforeEach(() => {
        optimize.persist();
      });

      it('persists the experiment from url to storage', () => {
        expect(localStorageMock.mock.setItem)
          .toHaveBeenCalledWith(
            optimize.key(),
            '{"variant":"tooltip","experimentId":"1"}'
          );
      });
    });

    describe('called with experiments', () => {
      let experiments;

      beforeEach(() => {
        experiments = {
          '69': {
            variant: 'doggy',
            experimentId: '69'
          }
        };
        optimize.persist(experiments);
      });

      it('persists the given experiments to storage', () => {
        expect(localStorageMock.mock.setItem)
        .toHaveBeenCalledWith(
          optimize.key(),
          '{"69":{"variant":"doggy","experimentId":"69"}}'
        );
      });
    });
  });
});
