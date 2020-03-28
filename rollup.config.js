import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import url from '@rollup/plugin-url';
import json from 'rollup-plugin-json';
import pkg from './package.json';

module.exports = {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      // exports: 'named',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  external: ['express', 'next', 'path', 'event-loop-monitor', 'fs', 'http-proxy-middleware', 'react', 'node-fetch'],
  plugins: [
    json(),
    resolve(),
    url(),
    babel({
      exclude: 'node_modules/**', // 只编译我们的源代码
    }),
    commonjs(),
  ],
};
