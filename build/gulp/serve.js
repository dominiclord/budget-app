var gulp = require('gulp');
var compile = require

gulp.task('serve', ['styles', 'watchJavascript'], function() {
    gulp.watch('./assets/styles/**/*.styl', ['styles']);
});
