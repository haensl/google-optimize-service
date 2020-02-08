import optimize from './google-optimize-service';

const mockLocation = (location = {
  search: '?variant=tooltip&utm_expid=1'
}) => {
  const originalLocation = window.location;
  Object.defineProperty(window, 'location', {
    value: location
  });
  return {
    restore: () => {
      Object.defineProperty(window, 'location', {
        value: originalLocation
      });
    }
  };
};

const mockLocalStorage = () => {
  const originalLocalStorage = window.localStorage;
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn(),
      setItem: jest.fn()
    }
  });
  return {
    restore: () => {
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage
      });
    }
  };
};

describe('google-optimize-service', () => {
  describe('key()', () => {
    beforeEach(() => {
      jest.resetModules();
    });

    it('returns the default key', () => {
      expect(optimize.key()).toEqual('optimize');
    });

    describe('called with argument', () => {
      describe('string', () => {
        it('sets and returns the new key', () => {
          expect(optimize.key('foo')).toEqual('foo');
        });
      });

      describe('non string', () => {
        beforeEach(() => {
          optimize.key('foo');
          if (optimize.key() !== 'foo') {
            throw new Error('Test setup incorrect.');
          }
        });

        it('ignores the argument and returns the old key', () => {
          expect(optimize.key(123)).toEqual('foo');
        });
      });
    });
  });

  describe('location', () => {
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

  describe('configure', () => {
    
  });

  describe.skip('get()', () => {
    let localStorageMock;
    let locationMock;
    let optimizeState;

    beforeAll(() => {
      localStorageMock = mockLocalStorage();
      locationMock = mockLocation();
    });

    afterAll(() => {
      locationMock.restore();
      localStorageMock.restore();
    });

    beforeEach(() => {
      window.localStorage.getItem.mockClear();
      window.localStorage.setItem.mockClear();
      optimizeState = optimize.get();
    });

    it('tries to retrieve the state from local storage', () => {
      expect(window.localStorage.getItem).toHaveBeenCalled();
    });

    it('parses the state from url query parameters', () => {
      expect(optimizeState).toEqual(
        expect.objectContaining({
          variant: 'tooltip',
          experimentId: '1'
        })
      );
    });

    it('saves the state to local storage', () => {
      expect(window.localStorage.setItem).toHaveBeenCalled();
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
});
