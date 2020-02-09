# google-optimize-service

[![NPM](https://nodei.co/npm/google-optimize-service.png?downloads=true)](https://nodei.co/npm/google-optimize-service/)

[![npm version](https://badge.fury.io/js/google-optimize-service.svg)](http://badge.fury.io/js/google-optimize-service)
[![Build Status](https://travis-ci.org/haensl/google-optimize-service.svg?branch=master)](https://travis-ci.org/haensl/google-optimize-service)

#### Handy universal service abstraction around Google Optimize.

google-optimize-service provides a lightweight abstraction layer around [Google Optimize](https://optimize.google.com/). It enables easy access to and management of experiment information.

## Quick Start

1. Install google-optimize-service

via **npm**:
```bash
npm i -S google-optimize-service
```

via **yarn**:
```bash
yarn add google-optimize-service
```

2. Import and use the service

ESM:

```javascript
import optimize from 'google-optimize-service';
optimize.preventFlicker();

const experiments = optmize.get();
```

CommonJS

```javascript
const optimize = require('google-optimize-service');

const experiments = optimize.get();
```

### [Changelog](CHANGELOG.md)

### [License](LICENSE)

The MIT License (MIT)

Copyright (c) Hans-Peter Dietz [@h_p_d](https://twitter.com/h_p_d) | [h.p.dietz@gmail.com](mailto:h.p.dietz@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
