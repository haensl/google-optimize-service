# google-optimize-service

[![NPM](https://nodei.co/npm/google-optimize-service.png?downloads=true)](https://nodei.co/npm/google-optimize-service/)


[![npm version](https://badge.fury.io/js/google-optimize-service.svg)](http://badge.fury.io/js/google-optimize-service)


[![CircleCI](https://circleci.com/gh/haensl/google-optimize-service.svg?style=svg)](https://circleci.com/gh/haensl/google-optimize-service)

#### Highly customizable, dependency-free, universal, service abstraction around Google Optimize.

google-optimize-service provides a lightweight abstraction layer around [Google Optimize](https://optimize.google.com/). It enables easy access to and management of experiment information.

## Table of Contents

* [Quick Start](#quick-start)
* [Features](#features)
* [API](#api)
  * [autopersist()](#api-autopersist)
  * [configure()](#api-configure)
  * [currentExperimentId()](#api-currentexperimentid)
  * [discover()](#api-discover)
  * [fields()](#api-fields)
  * [fromQuery()](#api-fromquery)
  * [get()](#api-get)
  * [key()](#api-key)
  * [location()](#api-location)
  * [persist()](#api-persist)
  * [preventFlicker()](#api-prevent-flicker)
  * [storage()](#api-storage)
  * [storagePreference()](#api-storage-preference)
  * [storagePreferences](#api-storage-preferences)
* [Changelog](#changelog)
* [License](#license)

## Quick Start<a name="quick-start"></a>

### 1. Install google-optimize-service

via **npm**:
```bash
npm i -S google-optimize-service
```

via **yarn**:
```bash
yarn add google-optimize-service
```


### 2. Import and use the service

#### ESM<a name="quick-start-esm"></a>

```javascript
import optimize from 'google-optimize-service';
optimize.preventFlicker();

const experiment = optmize.get();
/**
 * Assuming the query parameters set by Google Optimize:
 * ?utm_expid=69&utm_referrer=&variant=doggy
 *
 * experiment := {
 *   experimentId: '69', // google optimize experiment id, i.e. utm_expid
 *   referrer: '', // google optimize referrer, i.e. utm_referrer
 *   variant: 'doggy' // custom set experiment variable
 * }
 */
```

#### CommonJS<a name="quick-start-commonjs"></a>

```javascript
const optimize = require('google-optimize-service');

const experiment = optimize.get();
/**
 * Assuming the query parameters set by Google Optimize:
 * ?utm_expid=69&utm_referrer=&variant=doggy
 *
 * experiment := {
 *   experimentId: '69', // google optimize experiment id, i.e. utm_expid
 *   referrer: '', // google optimize referrer, i.e. utm_referrer
 *   variant: 'doggy' // custom set experiment variable
 * }
 */
```

## Features<a name="features"></a>

`google-optimize-service` is a highly customizable abstraction layer for [Google Optimize](https://optimize.google.com). As such it features:

#### [Autodiscovery](#api-discover) of the environment.

If run in a browser, `google-optimize-service` will automatically find the query parameters and check for available [storage](#api-storage) APIs to persist experiment data. If you're working in a non-browser environment, however, you can [tell `google-optimize-service` where to find URL query parameters](#api-location) and [how to persist experiment data](#api-storage).

#### [Custom fields](#api-fields) carrying your experiment variables.

By default `google-optimize-service` is setup to extract a `variant` from the URL. If your experiment, however, requires a more complex setup, e.g. with multiple or differently named experiment variables, [you can tell `google-optimize-service` which query parameters belong to your experiment](#api-fields).

#### [Auto-persistance](#api-persist) of experiment data.

To ensure your users will always see the same variant of your application, `google-optimize-service` by default [automatically persists](#api-autopersist) experiment data. Of course you can prevent persistance or employ your own [storage strategies](#api-storage) as you see fit.

#### [Flicker prevention](#api-prevent-flicker): anti-flicker snippet.

No need to manually add the [anti-flicker snippet](https://support.google.com/optimize/answer/7100284?hl=en) to your page, [`google-optimize-service`'s got you covered](#api-prevent-flicker).

#### Supports multiple experiments.

By employing persistance and discovery strategies, `google-optimize-service` facilitates work in an agile environment where change is frequent and/or multiple Optimize experiments run in parallel. This can help reduce the amount of work necessary to refactor experiment implementations.

#### Universal.

Whether you work on a [ESM powered SPA](#quick-start-esm) or in a [CommonJS powered Node.js project](#quick-start-commonjs) `google-optimize-service` has your back. It works with any modern JavaScript source base.

#### Lightweight and dependency-free.

`google-optimize-service` is implemented in a resource preserving manner and introduces zero additional production dependencies.

## Customization

`google-optimize-service` can be adjusted to your needs via a multitude of settings documented [in the API section](#api).

This is what it's default configuration looks like:

```javascript
{
  autopersist: true, // customize via autopersist().
  fields: [ // customize via fields().
    'variant'
  ],
  key: 'optimize', // customize via key().
  location: { // customize via location(). location is subject to autodiscovery.
    search: ''
  },
  storage: null, // customize via storage(). storage is subject to autodiscovery.
  storagePreference: storagePreferences.localStorage // customize via storagePreference().
}
```

All configuration is customizable:

* [autopersist()](#api-autopersist)
* [fields()](#api-fields)
* [location()](#api-location)
* [key()](#api-key)
* [storage()](#api-storage)
* [storagePreference()](#api-storage-preference)


## API<a name="api"></a>

### `autopersist([shouldPersist])`<a name="api-autopersist"></a>

#### default: `true`

Configure whether or not to automatically persist experiment data to [`storage`](#api-storage). If set to `true`, optimize will persist experiments found in the query with every call to [`get()`](#api-get).

If called without parameter, `autopersist()` returns the current `autopersist` setting.

#### Arguments

`shouldPersist` *optional* - a boolean indicating whether or not to persist experiment data to storage.

#### Example

```javascript
const optimize = require('google-optimize-service');

optimize.autopersist(true);
const experiment = optimize.get();

// experiment will be persisted to storage
```

### `configure(options)`<a name="api-configure"></a>

Wraps all configuration options into a convenient abstraction.

#### Arguments

`options` - a map containing configuration options. Valid, available configuration options are:

* [`autopersist`](#api-autopersist)
* [`fields`](#api-fields)
* [`key`](#api-key)
* [`location`](#api-location)
* [`storage`](#api-storage)
* [`storagePreference`](#api-storage-preference)

#### Example

```javascript
const optimize = require('google-optimize-service');

optimize.configure({
  autopersist: true,
  fields: [
    'variant',
    'subvariant'
  ],
  key: 'my-app',
  storagePreference: optimize.storagePreferences.sessionStorage
});
const experiment = optimize.get();
```

### `currentExperimentId()`<a name="api-currentexperimentid"></a>

Returns the [`utm_expid`](https://support.google.com/optimize/answer/6361119) of the current, i.e. as set in the URL query parameters, experiment.

#### Example

```javascript
const optimize = require('google-optimize-service');

const currentExperimentId = optimize.currentExperimentId();
```

### `discover()`<a name="api-discover"></a>

Autodiscovers configuration for the current environment. When calling `discover()`, `google-optimize-service` performs checks to see if a `window` object with `location` (and `search`) is available to retrieve experiment information from. Furthermore, `session`- and `localStorage` are checked and set as storage engines if available. Discover is automatically invoked upon first importing the `google-optimize-service`. Use [`storagePreference`](#api-storage-preference) to indicate whether you prefer `session`- or `localStorage` for your application.

#### Example

```javascript
const optimize = require('google-optimize-service');

optimize.discover();
const experiment = optimize.get();
```

### `fields([newFields])`<a name="api-fields"></a>

#### default: `[ 'variant' ]`

Set custom fields to retrieve from the URL query when parsing experiment data.

If called without parameter, `fields()` returns the current `fields` setting.

#### Arguments

`fields` *optional* - an Array of strings representing the name of query parameters that should be added to the experiment data.

#### Example

```javascript
const optimize = require('google-optimize-service');

optimize.fields([
  'variant',
  'subvariant'
]);
const experiment = optimize.get();

/**
 * experiment now contains properties variant and subvariant, if they are set in the query string.
 */
switch (experiment.variant) {
  case 'A':
    switch (experiment.subvariant) {
      case 1:
        // add code for variant A.1
        break;
    }
}
```

### `fromQuery()`<a name="api-fromquery"></a>

Returns experiment data from the URL query. Disregards persisted experiment information.

#### Example

```javascript
const optimize = require('google-optimize-service');

const experiment = optimize.fromQuery();
```

### `get([experimentId])`<a name="api-get"></a>

`get()` is your main entrypoint to experiment data. It consolidates stored experiment data with experiment data in the URL query, whereby stored data superseeds URL data. If not not provided `experimentId` defaults to the [`currentExperimentId`](#api-currentexperimentid). If there is experiment data in the URL query that is not persisted, yet, it is merged into the dataset. If [`autopersist`](#api-autopersist) is set to `true`, consolidated experiment data is persisted to [`storage`](#api-storage). If no `experimentId` is provided and there is no [`currentExperimentId`](#api-currentexperimentid) (or the parameter is deliberately set to `null` or `undefined`), a map of all experiments is returned. The map is keyed by `experimentId`.

#### Arguments

`experimentId` *optional* - the id of the experiment to retrieve. Defaults to the return value of [`currentExperimentId()`](#api-currentexperimentid). If not available or set to `null` or `undefined`, a map of all available experiments is returned.

#### Example

```javascript
const optimize = require('google-optimize-service');

const experiment = optimize.get();
// experiment is the current experiment

const someOtherExperiment = optimize.get(someOtherExperimentId);
// someOtherExperiment contains information about experiment with id someOtherExperimentId
```


### `key([newKey])`<a name="api-key"></a>

#### default: `'optimize'`

Sets the key used when persisting experiment information to [`storage`](#api-storage).

If called without parameter, returns the current key.

#### Arguments

`newKey` *optional* - if provided `newKey` is set as the key to use when persisting experiment information.


#### Example

```javascript
const optimize = require('google-optimize-service');

optimize.key('my-optimize-experiments')
const experiment = optimize.get();

// experiment data is fetched from and persisted to the key 'my-optimize-experiments'.
```

### `location([newLocation])`<a name="api-location"></a>

Sets the `location` object to use to retrieve `search`/`query` data from.

If called without parameter, returns the current `location`.

By default, `google-optimize-service` tries to discover if it is run in a browser and defaults to `window.location` if available. If you are working on the server-side, however, you may wish provide a different location object to parse experiment data from.

#### Arguments

`newLocation` *optional* - must be an object with a property `search`, e.g. `{ search: '?utm_expid=69&variant=naughty' }`, from which to parse experiment information.

#### Example

Use with [Koa](https://koajs.com/)<a name="use-with-koa"></a>

```javascript
const optimize = require('google-optimize-service');
const Router = require('koa-router');

const router = Router();

router.get('/', async (ctx) => {
  optimize.location({
    search: ctx.request.search
  });

  const experiment = optimize.get();
  // experiment data is parsed from ctx.request.search.
});
```

Use with [Express](https://expressjs.com/)<a name="use-with-express"></a>

```javascript
const optimize = require('google-optimize-service');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  optimize.location({
    search: req.originalUrl.slice(req.originalUrl.indexOf('?'))
  });

  const experiment = optimize.get();
  // experiment data is parsed from the original URL's query string.
});
```

### `persist([experiments])`<a name="api-persist"></a>

Persists experiment data to [`storage`](#api-storage) at [`key`](#api-key). If not provided as parameter, `persist()` tries to persist experiments returned by [`get()`](#api-get). If no [storage](#api-storage) is configured, this is a noop.

#### Arguments

`experiments` *optional* - The experiments to persist to storage. If not provided, `persist()` tries to retrieve experiment data from [`get()`](#api-get).

#### Example

```javascript
const optimize = require('google-optimize-service');

const experiments = optimize.get(null);
optimize.persist(experiments);
```

### `preventFlicker([timeout],[intervalMs])`<a name="api-prevent-flicker"></a>

Installs the [anti-flicker snippet](https://support.google.com/optimize/answer/7100284?hl=en).

#### Arguments

`timeout` *optional* - Timeout to wait for Google Analytics in milliseconds. **Default**: `2000`.

`intervalMs` *optional* - Interval in which to check for Google Analytics in milliseconds. **Default**: `10`.

#### Example

```javascript
const optimize = require('google-optimize-service');

optimize.preventFlicker();
```

### `storage([newStorage])`<a name="api-storage"></a>

Sets and returns the storage implementation to use.

If called without parameter, it returns the currently set storage engine.

By default `google-optimize-service` tries to discover available storage mechanisms and configures itself accoringly. E.g. if run in a browser, `google-optimize-service` can discover that both `localStorage` and `sessionStorage` are available on the `window` object. Depending on the set [`storagePreference`](#api-storage-preference), it configures itself to use one of those when [`discover()`](#api-discover)ing.

Supplying your own storage engine to use for [`persist()`](#api-persist)ing experiments, can come handy when working in non-browser environments. See the [examples section](#api-storage-examples) for illustration.

#### Arguments

`newStorage` *optional* - A storage engine to use when [persist()](#api-persist)ing experiment data. `newStorage` an be any custom storage solution implementing at least a minimum set of `setItem()` and `getItem()` from the [web storage API](https://developer.mozilla.org/en-US/docs/Web/API/Storage).

#### Example

Explicitly using `sessionStorage`

```javascript
const optimize = require('google-optimize-service');

optimize.storage(window.sessionStorage);
optimize.persist(optimize.get(null));
```

Using a custom storage engine

```javascript
const optimize = require('google-optimize-service');

const _store = {};
const store = {
  setItem: (key, value) => {
    _store[key] = value;
  },
  getItem: (key) => _store[key]
};

optimize.storage(store);
optimize.persist(optimize.get(null));
```


### `storagePreference([newPreference])`<a name="api-storage-preference"></a>

#### default: `optimize.storagePreferences.localStorage`

Sets the [storage preference](#api-storage-preferences) to use when deciding between `local`- and `sessionStorage` during [`discover()`](#api-discover).

If called without parameter, returns the current storage preference.

#### Arguments

`newPreference` *optional* - The storage preference to use. This should be one of the constants provided via [storagePreferences](#api-storage-preferences).

#### Example

```javascript
const optimize = require('google-optimize-service');

optimize.storagePreference(optimize.storagePreferences.sessionStorage);
optimize.discover();
optimize.persist(optimize.get(null));
```


### `storagePreferences`<a name="api-storage-preferences"></a>

Map of available storage preferences to be used with [`storagePreference()`](#api-storage-preference).

Currently available storage preferences:

`storagePreferences.localStorage` prefers `localStorage` over `sessionStorage`.

`storagePreferences.sessionStorage` prefers `sessionStorage` over `localStorage`.

#### `storagePreferences` constitute only a hint. I.e. if the storage preference is set to `sessionStorage` but only `localStorage` is available, `google-optimize-service` will pick `localStorage`.


### [Changelog](CHANGELOG.md)<a name="changelog"></a>

### [License](LICENSE)<a name="license"></a>

The MIT License (MIT)

Copyright (c) Hans-Peter Dietz [@h_p_d](https://twitter.com/h_p_d) | [h.p.dietz@gmail.com](mailto:h.p.dietz@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
