'use strict';
var gulp = require('gulp');
var watch = require('gulp-watch');
var ejs = require("gulp-ejs");
gulp.task('ejs', function() {
    return gulp.src("./html/**/*.html")
        .pipe(ejs({
            msg: "Hello Gulp!"
        }))
        .pipe(gulp.dest("./dist"))
});
gulp.task('default',function(){
    gulp.start('ejs','watch');
});
gulp.task('watch',function(){
    gulp.watch("./html/**/*.html",['ejs']);
});