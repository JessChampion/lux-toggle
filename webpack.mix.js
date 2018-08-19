/* eslint-disable prefer-template,import/no-extraneous-dependencies */
const mix = require('laravel-mix');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const srcPath = 'src/';
const destPath = 'dist/';

const SRC = {
  js: srcPath + 'lux-toggle.js',
  demo: {
    index: 'demo/index.html',
    main: 'demo/main.js',
    styles: 'demo/main.scss'
  }
};

const DEST = {
  js: destPath,
  demo: destPath + 'demo/'
};

mix.setPublicPath(__dirname);
mix.config.resourceRoot = '';
mix.config.publicPath = 'dist/demo';

// build the utility
mix.js(SRC.js, DEST.js);

// build the demo
mix.js(SRC.demo.main, DEST.demo);
mix.sass(SRC.demo.styles, DEST.demo);

mix.copy(SRC.demo.index, DEST.demo);

// Custom webpack config
if (mix.inProduction()) {
  mix.webpackConfig({
    plugins: [
      new BundleAnalyzerPlugin()
    ]
  });
}
