import ascii from 'rollup-plugin-ascii';
import node from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import * as pkg from './package.json';

const copyright = `// ${pkg.homepage} v${pkg.version} Copyright ${(new Date()).getFullYear()} ${pkg.author.name}`;

export default [
  {
    input: 'src/google-optimize-service',
    plugins: [
      babel({
        exclude: 'node_modules/**'
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
      babel({
        exclude: 'node_modules/**'
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
      babel({
        exclude: 'node_modules/**'
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
  }
];
