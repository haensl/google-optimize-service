import ascii from 'rollup-plugin-ascii';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonJS from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
import * as pkg from './package.json';

const copyright = `// ${pkg.homepage} v${pkg.version} Copyright ${(new Date()).getFullYear()} ${pkg.author.name}`;

export default [
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
