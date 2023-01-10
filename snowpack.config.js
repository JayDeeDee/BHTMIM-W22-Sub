module.exports = {
  mount: {
    'src-snowpack': '/'
  },
  plugins: [
    [
      '@snowpack/plugin-sass',
      { }
    ],
    [
      'snowpack-plugin-imagemin',
      {
        'include': [',**/*.jpg', '**/*.png'],
        'plugins': [require('imagemin-mozjpeg')(),require('imagemin-optipng')()]
      }
    ],
    [
      '@snowpack/plugin-optimize',
      { }
    ]
  ],
  buildOptions: {
    out: 'dist-snowpack'
  },
  packageOptions: {
    cache: '.cache'
  },
  optimize: {
    minify: true,
    bundle: true,
    treeshake: true,
    splitting: true,
    target: 'es2020'
  }
}