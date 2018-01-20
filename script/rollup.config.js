'use strict';

const buble = require('rollup-plugin-buble');
const fsJetpack = require('fs-jetpack');
const pjson = require('../package.json');

let banner = `
/*
 * ${pjson.name} v${pjson.version}
 * (c) ${new Date().getFullYear()} @Johnny Wu
 * Released under the MIT License.
 */
`;

let dest = './dist';
let file = 'memop';
let name = 'memop';
let sourcemap = true;
let globals = {
  'vmath': 'window.vmath',
  'scene-graph': 'window.sgraph',
  'WebGLRenderingContext': 'window.WebGLRenderingContext',
};

// clear directory
fsJetpack.dir(dest, { empty: true });

module.exports = {
  input: './index.js',
  external: [
    'vmath',
    'scene-graph',
    'WebGLRenderingContext',
  ],
  plugins: [
    buble(),
  ],
  output: [
    {
      file: `${dest}/${file}.dev.js`,
      format: 'iife',
      name,
      banner,
      globals,
      sourcemap,
    },
    {
      file: `${dest}/${file}.js`,
      format: 'cjs',
      name,
      banner,
      globals,
      sourcemap,
    },
  ],
};