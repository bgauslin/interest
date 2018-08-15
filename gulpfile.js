const gulp         = require('gulp');

const autoprefixer = require('gulp-autoprefixer');
const babelify     = require('babelify');
const browserify   = require('browserify');
const browserSync  = require('browser-sync');
const cssnano      = require('gulp-cssnano');
const fs           = require('fs');
const hash         = require('gulp-hash');
const plumber      = require('gulp-plumber');
const stylus       = require('gulp-stylus');
const uglify       = require('gulp-uglify-es').default;

const onError = (err) => console.log(err);

// ------------------------------------------------------------
// Configuration.

const project = 'calculator';

const devServer = project + '.gauslin.test';

const paths = {
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
    'dest': 'public/ui/js/' + project + '.js',
  },
  'stylus': {
    'src': 'source/stylus/' + project + '.styl',
    'dest': 'public/ui/css',
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
  'default': [
    'html',
    'icons',
    'js',
    'pwa',
    'stylus',
    // 'sw',
    'webfonts'
  ]
};


// ------------------------------------------------------------
// Individual tasks.

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

// TODO: full 'js' task: browserify -> babelify -> uglify.
gulp.task('js', () => {
  browserify(paths.js.src)
    .transform(babelify.configure({
      presets: ['@babel/preset-env']
    }))
    .bundle()
    .pipe(fs.createWriteStream(paths.js.dest));
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
    .pipe(cssnano())
    .pipe(gulp.dest(paths.stylus.dest));
});

// Copy the Service Worker.
gulp.task('sw', () => {
  gulp.src(paths.sw.src)
    .pipe(gulp.dest(paths.sw.dest));
});

// Uglify generated js.
gulp.task('uglify', () => {
  gulp.src(paths.js.dest)
    .pipe(uglify())
    .pipe(gulp.dest(paths.uglify.dest));
});

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

// Copy webfonts.
gulp.task('webfonts', () => {
  gulp.src(paths.webfonts.src)
    .pipe(gulp.dest(paths.webfonts.dest));
});

// ------------------------------------------------------------
// Composite tasks.

gulp.task('watch', tasks.default, () => {
  const watcher = gulp.watch('./source/**/*', ['refresh']);
  watcher.on('change', (event) => {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});

gulp.task('browser-sync', ['watch'], () => {
  return browserSync({ proxy: devServer });
});

gulp.task('refresh', tasks.default, browserSync.reload);

// ------------------------------------------------------------
// Default task.

gulp.task('default', ['browser-sync']);
