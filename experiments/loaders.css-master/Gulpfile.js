(function() {
  var autoprefixer, cssmin, gulp, gutil, jade, plumber, rename, sass;

  gulp = require('gulp');

  sass = require('gulp-sass');

  jade = require('gulp-jade');

  cssmin = require('gulp-cssmin');

  rename = require('gulp-rename');

  autoprefixer = require('gulp-autoprefixer');

  gutil = require('gulp-util');

  plumber = require('gulp-plumber');

  gulp.task('scss:compile', function() {
    return gulp.src('./src/loaders.scss').pipe(plumber(function(err) {
      return console.log(err.stack);
    })).pipe(sass()).pipe(autoprefixer("last 2 versions", "> 1%", "ie 8", {
      map: false
    })).pipe(plumber.stop()).pipe(gulp.dest('./')).pipe(cssmin()).pipe(rename({
      suffix: '.min'
    })).pipe(gulp.dest('./')).on('finish', function() {
      return gutil.log('scss build finished.');
    });
  });

  gulp.task('demo:scss:compile', function() {
    return gulp.src('./demo/src/demo.scss').pipe(sass({
      errLogToConsole: true
    }).on("error", gutil.log).on("error", gutil.beep)).pipe(gulp.dest('./demo/'));
  });

  gulp.task('demo:jade:compile', function() {
    return gulp.src('./demo/src/*.jade').pipe(jade({
      pretty: true
    })).pipe(gulp.dest('./demo/'));
  });

  gulp.task('watch', function() {
    gulp.watch('src/**/*.scss', ['scss:compile']);
    gulp.watch('demo/src/**/*.scss', ['demo:scss:compile']);
    return gulp.watch('demo/src/**/*.jade', ['demo:jade:compile']);
  });

  gulp.task('demo', ['demo:scss:compile', 'demo:jade:compile']);

  gulp.task('default', ['scss:compile', 'demo', 'watch']);

}).call(this);
