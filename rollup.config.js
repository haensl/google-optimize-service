import ascii from 'rollup-plugin-ascii';
import node from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import * as pkg from './package.json';

const copyright = `// ${pkg.homepage} v${pkg.version} Copyright ${(new Date()).getFullYear()} ${pkg.author.name}`;

export default [
  {
    input: 'src/google-optimize-service',
    plugins: [
      builtins(),
      babel({
        babelrc: false,
        exclude: 'node_modules/**',
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                browsers: [
                  'defaults'
                ]
              }
            }
          ]
        ]
      }),
      node(),
      ascii()
    ],
    output: {
      extend: true,
      banner: copyright,
      file: 'lib/google-optimize-service.js',
      format: 'umd',
      indent: false,
      name: pkg.name
    }
  },
  {
    input: 'src/google-optimize-service',
    plugins: [
      builtins(),
      babel({
        babelrc: false,
        exclude: 'node_modules/**',
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                browsers: [
                  'defaults'
                ]
              }
            }
          ]
        ]
      }),
      node(),
      ascii(),
      terser({
        output: {
          preamble: copyright
        }
      })
    ],
    output: {
      extend: true,
      file: 'lib/google-optimize-service.min.js',
      format: 'umd',
      indent: false,
      name: pkg.name
    }
  },
  {
    input: 'src/google-optimize-service',
    plugins: [
      builtins(),
      babel({
        babelrc: false,
        exclude: 'node_modules/**',
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                esmodules: true
              }
            }
          ]
        ]
      }),
      node(),
      ascii()
    ],
    output: {
      extend: true,
      banner: copyright,
      file: 'lib/google-optimize-service.esm.js',
      format: 'esm',
      indent: false,
      name: pkg.name
    }
  },
  {
    input: 'src/google-optimize-service',
    external: [
      'querystring'
    ],
    plugins: [
      node(),
      ascii()
    ],
    output: {
      extend: true,
      banner: copyright,
      file: 'lib/google-optimize-service.node.js',
      format: 'cjs',
      indent: false,
      name: pkg.name
    }
  }
];
