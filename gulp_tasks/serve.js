var gulp = require('gulp');

gulp.task('serve', ['styles'], function() {
    gulp.watch('./assets/styles/**/*.styl', ['styles']);
});