var gulp = require('gulp');
var stylus = require('gulp-stylus');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var mqpacker = require('css-mqpacker');
var csswring = require('csswring');

gulp.task('styles', function () {
    var processors = [
        autoprefixer({browsers: ['last 2 versions', '> 1%', 'ie >= 9']}),
        mqpacker,
        csswring
    ];
    return gulp.src('assets/styles/main.styl')
        .pipe(stylus())
        .pipe(postcss(processors))
        .pipe(gulp.dest('www/assets/styles'));
});