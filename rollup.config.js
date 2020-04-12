import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import url from '@rollup/plugin-url';
import json from 'rollup-plugin-json';
import { uglify } from 'rollup-plugin-uglify';

const buildENV = process.env.BUILD_ENV;

const plugins = [
  json(),
  resolve(),
  url(),
  babel({
    exclude: 'node_modules/**', // 只编译我们的源代码
  }),
  commonjs(),
];

if (buildENV !== 'dev') {
  plugins.push(uglify());
}

const external = ['express', 'next', 'path', 'event-loop-monitor', 'fs', 'http-proxy-middleware', 'react', 'node-fetch', 'os'];

module.exports = [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    external: external,
    plugins,
  },
  {
    input: 'src/index.lib.js',
    output: {
      file: 'dist/lib.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    external: external,
    plugins,
  },
];
