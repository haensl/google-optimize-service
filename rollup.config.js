const  ascii =  require('rollup-plugin-ascii');
const nodeResolve = require('@rollup/plugin-node-resolve');
const  commonJS =  require('@rollup/plugin-commonjs');
const external = require('rollup-plugin-peer-deps-external');
const nodePolyfills = require('rollup-plugin-node-polyfills');
const terser = require('@rollup/plugin-terser');
const babel = require('@rollup/plugin-babel');
const pkg = require('./package.json');

const copyright = `// ${pkg.homepage} v${pkg.version} Copyright ${(new Date()).getFullYear()} ${pkg.author.name}`;

module.exports = [
  {
    input: 'src/google-optimize-service',
    output: {
      esModule: false,
      exports: 'named',
      file: pkg.unpkg,
      format: 'umd',
      name: pkg.name,
      indent: false
    },
    plugins: [
      ascii(),
      babel({
        babelrc: false,
        exclude: [
          'node_modules/**',
          '**/*.test.js'
        ],
        babelHelpers: 'bundled',
        presets: [
          [
            '@babel/preset-env',
            {
              modules: false
            }
          ]
        ]
      }),
      nodePolyfills(),
      nodeResolve(),
      external(),
      commonJS({
        include: 'node_modules/**'
      }),
      terser({
        output: {
          preamble: copyright
        }
      })
    ]
  },
  {
    external: [
      /@babel\/runtime/
    ],
    input: 'src/google-optimize-service',
    output: [
      {
        file: pkg.module,
        format: 'esm',
        indent: false,
        name: pkg.name,
        sourcemap: true
      }
    ],
    plugins: [
      ascii(),
      babel({
        babelrc: false,
        exclude: [
          'node_modules/**',
          '**/*.test.js'
        ],
        babelHelpers: 'runtime',
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                esmodules: true
              }
            }
          ]
        ],
        plugins: [
          '@babel/plugin-transform-runtime'
        ]
      }),
      nodePolyfills(),
      nodeResolve(),
      external(),
      commonJS({
        include: 'node_modules/**'
      }),
      terser({
        output: {
          preamble: copyright
        }
      })
    ]
  },
  {
    input: 'src/google-optimize-service',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        name: pkg.name,
        indent: false,
        exports: 'named',
        sourcemap: true
      }
    ],
    external: [
      'querystring',
      /@babel\/runtime/
    ],
    plugins: [
      ascii(),
      babel({
        babelrc: false,
        exclude: [
          'node_modules/**',
          '**/*.test.js'
        ],
        babelHelpers: 'runtime',
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                node: true
              }
            }
          ]
        ],
        plugins: [
          '@babel/plugin-transform-runtime'
        ]
      }),
      nodeResolve(),
      external(),
      commonJS({
        include: 'node_modules/**'
      }),
      terser({
        output: {
          preamble: copyright
        }
      })
    ]
  }
];
