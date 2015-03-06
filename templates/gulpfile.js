var gulp = require('gulp'),
    gutil = require('gulp-util'),
    fs = require('fs'),
    http = require('http'),
    del = require('del'),
    plumber = require('gulp-plumber'),
    jade = require('gulp-jade'),
    stylus = require('gulp-stylus'),
    babel = require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps'),
    coffee = require('gulp-coffee'),
    livereload = require('gulp-livereload'),
    embedlr = require('gulp-embedlr'),
    express = require('express'),
    bodyParser = require('body-parser'),
    ip = require('ip');

var appPort = 9001,
    lrPort = 35728,
    lrOpt = {port: lrPort},
    location = { hostname: ip.address() },
    inlineOpt = { minify: false },
    plumberOpt = { errorHandler: function (err) { gutil.beep(); gutil.log(err);}},
    jsonParser = bodyParser.json();

gulp.task('clean', function() {
    return del.sync(['public']);
         
});

gulp.task('extern', function() {
    return gulp.src(['src/assets/**/*', 'src/vendor/**/*'])
           .pipe(gulp.dest('public/assets/'))
           .pipe(livereload(lrPort));
});

gulp.task('jade',  function() {
    return gulp.src('src/**/*.jade')
           .pipe(plumber(plumberOpt))
           .pipe(jade({pretty: true}))
           .pipe(embedlr(lrOpt))
           .pipe(gulp.dest('public/'))
           .pipe(livereload(lrPort));
});

gulp.task('html', function() {
    return gulp.src('src/**/*.html')
           .pipe(plumber(plumberOpt))
           .pipe(embedlr(lrOpt))
           .pipe(gulp.dest('public/'))
           .pipe(livereload(lrPort));
});

gulp.task('coffee', function() {
    return gulp.src('src/scripts/**/*.coffee')
           .pipe(plumber(plumberOpt))
           .pipe(sourcemaps.init())
           .pipe(coffee({bare: true}))
           .pipe(sourcemaps.write('../maps'))
           .pipe(gulp.dest('public/scripts/'))
           .pipe(livereload(lrPort));
});

gulp.task('scripts', function() {
    return gulp.src('src/scripts/**/*.js')
           .pipe(plumber(plumberOpt))
           .pipe(sourcemaps.init())
           .pipe(babel())
           .pipe(sourcemaps.write('../maps'))
           .pipe(gulp.dest('public/scripts/'))
           .pipe(livereload(lrPort));
});

gulp.task('stylus', function() {
    return gulp.src('src/styles/**/*.styl')
           .pipe(plumber(plumberOpt))
           .pipe(stylus({error: true}))
           .pipe(gulp.dest('public/styles/'))
           .pipe(livereload(lrPort));
});

gulp.task('styles', function() {
    return gulp.src('src/styles/**/*.css')
           .pipe(plumber(plumberOpt))
           .pipe(gulp.dest('public/styles/'))
           .pipe(livereload(lrPort));
});

gulp.task('serve', function() {
    var app = express();
    app.use(express.static('public'));
    app.use(express.static('bower_components/fui-angular'));
    app.use(express.static('bower_components'));
    app.post('/', jsonParser, function(req, res) {
        //
    });  
    app.listen(appPort);
});

gulp.task('default_watch', function() {
    gulp.watch('src/assets/**/*', ['assets']);
    gulp.watch('src/vendor/**/*', ['vendor']);
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/scripts/**/*.js', ['scripts', 'html']);
    gulp.watch('src/styles/**/*.css', ['styles', 'html']);
    gulp.watch('src/**/*.jade', ['jade']);
    gulp.watch('src/styles/**/*.styl', ['stylus','jade']);
    gulp.watch('src/scripts/**/*.coffee', ['coffee','jade']);
});

gulp.task('default', ['html',
                      'jade',
                      'scripts',
                      'coffee',
                      'styles',
                      'stylus',
                      'extern',
                      'serve',
                      'default_watch']);
