const pkg = require('./package.json');

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
// Individual tasks.

// Copy htaccess.
gulp.task('apache', () => {
  gulp.src(pkg.paths.apache.src)
    .pipe(rename(pkg.paths.apache.name))
    .pipe(gulp.dest(pkg.paths.apache.dest));
});

// Copy html.
gulp.task('html', () => {
  gulp.src(pkg.paths.html.src)
    .pipe(gulp.dest(pkg.paths.html.dest));
});

// Copy icons.
gulp.task('icons', () => {
  gulp.src(pkg.paths.icons.src)
    .pipe(gulp.dest(pkg.paths.icons.dest));
});

// Compile and uglify JavaScript.
gulp.task('js', () => {
  return browserify({ entries: pkg.paths.js.src, debug: true })
    .transform('babelify', {'presets': [['@babel/preset-env', {'targets': {'node': 'current'}}]]})
    .bundle()
    .pipe(source(pkg.paths.js.bundleSrc))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(pkg.paths.js.bundleDest));
});

// Copy JSON.
gulp.task('json', () => {
  gulp.src(pkg.paths.json.src)
    .pipe(gulp.dest(pkg.paths.json.dest));
});

// Copy PWA assets.
gulp.task('pwa', () => {
  gulp.src(pkg.paths.pwa.src)
    .pipe(gulp.dest(pkg.paths.pwa.dest));
});

// Compile and minify stylus.
gulp.task('stylus', () => {
  gulp.src(pkg.paths.stylus.src)
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
    .pipe(gulp.dest(pkg.paths.stylus.dest));
});

// Copy the Service Worker.
// TODO: 'sw' is disabled for now
gulp.task('sw', () => {
  return;
  gulp.src(pkg.paths.sw.src)
    .pipe(gulp.dest(pkg.paths.sw.dest));
});

// Copy webfonts.
gulp.task('webfonts', () => {
  gulp.src(pkg.paths.webfonts.src)
    .pipe(gulp.dest(pkg.paths.webfonts.dest));
});

// ------------------------------------------------------------
// Composite tasks (in order of operation).

gulp.task('browser-sync', ['watch'], () => {
  return browserSync({ proxy: pkg.devServer });
});

gulp.task('watch', pkg.tasks.default, () => {
  const watcher = gulp.watch('./source/**/*', ['refresh']);
  watcher.on('change', (event) => {
    console.log(`File ${event.path} was ${event.type}, running tasks...`);
  });
});

gulp.task('refresh', pkg.tasks.default, browserSync.reload);

// ------------------------------------------------------------
// Primary tasks.

// One-time build.
gulp.task('build', pkg.tasks.build, () => console.log('Build completed.'));

// Build, listen, reload.
gulp.task('default', ['browser-sync']);

// Create hashed files for production.
gulp.task('version', () => {
  gulp.src(pkg.paths.version.src)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(hash())
    .pipe(gulp.dest(pkg.paths.version.dest))
    .pipe(hash.manifest(pkg.paths.version.manifestFile, {
      deleteOld: true,
    }))
    .pipe(gulp.dest('.'));
});