var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('scripts', function() {
    return browserify({ entries: ['assets/scripts/main.js'] })
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('www/assets/scripts'));
});