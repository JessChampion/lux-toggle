/* eslint-disable prefer-template,import/no-extraneous-dependencies */
const mix = require('laravel-mix');

const srcPath = 'src/';
const destPath = 'dist/';

const SRC = {
  js: srcPath + 'lux-toggle.js'
};

const DEST = {
  js: destPath
};

mix.setPublicPath(__dirname);

mix.js(SRC.js, DEST.js);