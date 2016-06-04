var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var browserifyshim = require('browserify-shim');

function compile(watch) {
  var debug = false;
  var bundler =
    watchify(
      browserify('./assets/scripts/app.js', { debug: debug })
      .transform(babel.configure({
        // Use all of the ES2015 spec
        presets: ['es2015']
      }))
      .transform(browserifyshim)
    );

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./www/assets/scripts'));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
}

function watch() {
  return compile(true);
};

gulp.task('watchJavascript', function() { return watch(); });
gulp.task('javascript', function() { return compile(); });
