const gulp = require('gulp'),
      browserSync = require('browser-sync'),
      postcss = require('gulp-postcss'),
      less = require('gulp-less'),
      autoprefixer = require('autoprefixer'),
      reload = browserSync.reload,
      csso = require('gulp-csso'),
      imagemin = require('gulp-imagemin'),
      pngquant = require('imagemin-pngquant'),
      cache = require('gulp-cache'),
      nunjucksRender = require('gulp-nunjucks-render');

gulp.task('webserver', function () {
  browserSync({
    server: {
      baseDir: "./docs"
    },
    // tunnel: true,
    host: 'localhost',
    port: 9001
  });
});

// HTML
gulp.task('html', function () {
  return gulp.src('src/templates/**/*.html')
    .pipe(nunjucksRender({
      path: ['src/templates/']
    }))
    .pipe(gulp.dest('docs'))
    .pipe(reload({stream: true}));
});

// Styles
gulp.task('styles', () => {
  return gulp.src('./src/less/styles.less')
    .pipe(less())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(csso())
    .pipe(gulp.dest('./docs/static/css/'))
    .pipe(reload({stream: true}));
})

// Images
gulp.task('images', function() {
  return gulp.src('./src/images/**/*')
      .pipe(cache(imagemin({
          interlaced: true,
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [pngquant()]
      })))
      .pipe(gulp.dest('docs/static/images'));
});

gulp.task('watch', function() {
  gulp.watch('./src/templates/**/*.html', gulp.series('html'));
  gulp.watch('./src/less/**/*.less', gulp.series('styles'));
  gulp.watch('./src/images/**/*', gulp.series('images'));
});

gulp.task('default', gulp.parallel('webserver','watch'));