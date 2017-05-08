'use strict';
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var data = require('gulp-data');
var browserSync = require('browser-sync');
var ejs = require('gulp-ejs');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var tplDir = './templates';  // 模版目录
var distDir = './dist/';      // 生成目录
var imagemin=require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var similar='_SM';
// 模版合并
gulp.task('styles', function () {
    return gulp.src('./templates/css/**/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(distDir+'/css'));
});
gulp.task('scripts', function() {
    return gulp.src('./templates/js/**/*.js')
        .pipe(plumber())
      /*  .pipe(uglify())
        .pipe(rename(function (path) {
            path.basename += ".min";
        }))*/
        .pipe(gulp.dest(distDir+'/js'));
});
gulp.task('copy-ejs', function () {
    return gulp.src(tplDir +'/compileEjs/*.ejs').pipe(gulp.dest(distDir+'/compileEjs'));
});
gulp.task('copy-css', function () {
    return gulp.src(tplDir +'/js/**/*.css').pipe(gulp.dest(distDir+'/js'));
});
gulp.task('copy-font', function () {
    return gulp.src(tplDir +'/fonts/*').pipe(gulp.dest(distDir+'/fonts'));
});
gulp.task('testpng',function(){
    return gulp.src(tplDir +'/images/*.{gif,jpg,png}').pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use:[pngquant()]
    })).pipe(gulp.dest(distDir+'/images'));
});
gulp.task('ejs', function () {
    gulp.src(tplDir + '/**/*.html')
        .pipe(data(function (file) {
            var filePath = file.path;
            // global.json 全局数据，页面中直接通过属性名调用
            try{
                return Object.assign(JSON.parse(fs.readFileSync(path.join(path.dirname(filePath)+'/json', 'global.json'))), {
                    // local: 每个页面对应的数据，页面中通过 local.属性 调用
                    local: JSON.parse(fs.readFileSync(path.join(path.dirname(filePath)+'/json', path.basename(filePath, '.html') + '.json')))//path.basename(filePath, '.html')拿到文件名，第二个参数是过滤掉这个字段；
                })
            }catch(e){
                try{
                    var fileName=path.basename(filePath, '.html');
                    if(fileName.indexOf(similar)>0){
                        return Object.assign(JSON.parse(fs.readFileSync(path.join(path.dirname(filePath)+'/json', 'global.json'))), {
                            local: JSON.parse(fs.readFileSync(path.join(path.dirname(filePath)+'/json', fileName.substring(0,fileName.indexOf(similar)) + '.json')))
                        })
                    }else{
                        return Object.assign(JSON.parse(fs.readFileSync(path.join(path.dirname(filePath)+'/json', 'global.json'))), {
                            local: {}
                        })
                    }
                }catch(e){}
            }
        }))
        .pipe(ejs().on('error', function (err) {
            gutil.log(err);
            this.emit('end');
        }))
        .pipe(gulp.dest(distDir));
});
gulp.task('ejs-watch', ['ejs','styles','scripts','copy-ejs','copy-css','copy-font'], browserSync.reload);
// 开发服务
gulp.task('dev', function () {
    browserSync.init({
        server: {
            baseDir: distDir,
            index:"/html/index.html"
        },
        reloadDebounce: 0
    });
    // 无论是数据文件更改还是模版更改都会触发页面自动重载
    gulp.watch(tplDir + '/**/*.*', ['ejs-watch']);
});
gulp.task('default',['styles','scripts','ejs','copy-ejs','testpng','dev','copy-css','copy-font']);
