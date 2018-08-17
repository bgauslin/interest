const gulp         = require('gulp');

const autoprefixer = require('gulp-autoprefixer');
const babelify     = require('babelify');
const browserify   = require('browserify');
const browserSync  = require('browser-sync');
const buffer       = require('vinyl-buffer');
const cssnano      = require('gulp-cssnano');
const hash         = require('gulp-hash');
const plumber      = require('gulp-plumber');
const rename       = require('gulp-rename');
const source       = require('vinyl-source-stream');
const stylus       = require('gulp-stylus');
const uglify       = require('gulp-uglify-es').default;

const onError = (err) => console.log(err);

// ------------------------------------------------------------
// Configuration.

const project = 'calculator';

const devServer = project + '.gauslin.test';

const paths = {
  'apache': {
    'src': 'source/apache/_htaccess',
    'name': '.htaccess',
    'dest': 'public',
  },
  'html': {
    'src': 'source/html/**/*.*',
    'dest': 'public',
  }, 
  'icons': {
    'src': 'source/icons/**/*.*',
    'dest': 'public/ui/icons',
  },
  'js': {
    'src': 'source/js/' + project + '.js',
    'dest': 'public/ui/' + project + '.js',
    'b_src': project + '.js',
    'b_dest': 'public/ui',
  },
  'stylus': {
    'src': 'source/stylus/' + project + '.styl',
    'dest': 'public/ui',
  },
  'version': {
    'src': [
      'public/ui/' + project + '.css',
      'public/ui/' + project + '.js',
    ],
    'dest': 'public/build/ui',
    'manifestFile': 'public/build/manifest.json',
  },
  'pwa': {
    'src': 'source/pwa/**/*.*',
    'dest': 'public/pwa',
  },
  'sw': {
    'src': 'source/js/sw.js',
    'dest': 'public',
  },
  'uglify': {
    'dest': 'public/ui',
  },
  'webfonts': {
    'src': 'source/webfonts/**/*.*',
    'dest': 'public/ui/webfonts',
  },
};

const tasks = {
  'build': [
    'apache',
    'html',
    'icons',
    'js',
    'pwa',
    'stylus',
    // 'sw',
    'webfonts'
  ],
  'default': [
    'html',
    'js',
    'stylus',
  ]
};

// ------------------------------------------------------------
// Individual tasks.

// Copy htaccess.
gulp.task('apache', () => {
  gulp.src(paths.apache.src)
    .pipe(rename(paths.apache.name))
    .pipe(gulp.dest(paths.apache.dest));
});

// Copy html.
gulp.task('html', () => {
  gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest));
});

// Copy icons.
gulp.task('icons', () => {
  gulp.src(paths.icons.src)
    .pipe(gulp.dest(paths.icons.dest));
});

// Compile and uglify JavaScript.
gulp.task('js', () => {
  return browserify({ entries: paths.js.src, debug: true })
    .transform('babelify', { presets: ['@babel/preset-env'] })
    .bundle()
    .pipe(source(paths.js.b_src))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.b_dest));
});

// Copy PWA assets.
gulp.task('pwa', () => {
  gulp.src(paths.pwa.src)
    .pipe(gulp.dest(paths.pwa.dest));
});

// Compile and minify stylus.
gulp.task('stylus', () => {
  gulp.src(paths.stylus.src)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(stylus())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cssnano({
      discardUnused: false,
      minifyFontValues: false,
    }))
    .pipe(gulp.dest(paths.stylus.dest));
});

// Copy the Service Worker.
gulp.task('sw', () => {
  gulp.src(paths.sw.src)
    .pipe(gulp.dest(paths.sw.dest));
});

// Copy webfonts.
gulp.task('webfonts', () => {
  gulp.src(paths.webfonts.src)
    .pipe(gulp.dest(paths.webfonts.dest));
});

// ------------------------------------------------------------
// Composite tasks.

gulp.task('browser-sync', ['watch'], () => {
  return browserSync({ proxy: devServer });
});

gulp.task('refresh', tasks.default, browserSync.reload);

gulp.task('watch', tasks.default, () => {
  const watcher = gulp.watch('./source/**/*', ['refresh']);
  watcher.on('change', (event) => {
    console.log(`File ${event.path} was ${event.type}, running tasks...`);
  });
});

// ------------------------------------------------------------
// Main tasks.

// One-time build.
gulp.task('build', tasks.build, () => console.log('Build completed.'));

// Build, listen, reload.
gulp.task('default', ['browser-sync']);

// Create hashed files for production.
gulp.task('version', () => {
  gulp.src(paths.version.src)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(hash())
    .pipe(gulp.dest(paths.version.dest))
    .pipe(hash.manifest(paths.version.manifestFile, {
      deleteOld: true,
    }))
    .pipe(gulp.dest('.'));
});