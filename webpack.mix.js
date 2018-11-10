/* eslint-disable prefer-template,import/no-extraneous-dependencies */
const mix = require('laravel-mix');

const srcPath = 'src/';
const destPath = 'dist/';

const SRC = {
    js: srcPath + 'lux-toggle.js',
    demo: {
        images: 'demo/images',
        index: 'demo/index.html',
        main: 'demo/main.js',
        styles: 'demo/main.scss'
    }
};

const DEST = {
    js: destPath,
    demo: destPath + 'demo/',
    images: destPath + 'demo/images/'
};

mix.setPublicPath(__dirname);
mix.config.resourceRoot = '';

mix.copy(SRC.js, DEST.js);

mix.copy(SRC.demo.index, DEST.demo)
    .copyDirectory(SRC.demo.images, DEST.images);

mix.js(SRC.demo.main, DEST.demo)
    .sass(SRC.demo.styles, DEST.demo).options({processCssUrls: false});