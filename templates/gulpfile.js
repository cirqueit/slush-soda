var gulp = require('gulp'),
    gutil = require('gulp-util'),
    fs = require('fs'),
    http = require('http'),
    del = require('del'),
    plumber = require('gulp-plumber'),
    jade = require('gulp-jade'),
    less = require('gulp-less'),
    stylus = require('gulp-stylus'),
    sourcemaps = require('gulp-sourcemaps'),
    react = require('gulp-react'),
    babel = require('gulp-babel'),
    coffee = require('gulp-coffee'),
    livereload = require('gulp-livereload'),
    embedlr = require('gulp-embedlr'),
    express = require('express'),
    bodyParser = require('body-parser'),
    os = require('os');

var local = false,
    hosts = [],
    iface = os.networkInterfaces();

for (var key in iface) {
    if (local || iface[key][0].address.substring(0,3) !== '127') {
        hosts.push(iface[key][0].address);
    }
}

var appPort = 9001,
    lrPort = 35728,
    location = { hostname: hosts[0] },
    lrOpt = { host: hosts[0], port: lrPort },
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

gulp.task('react', function() {
    return gulp.src('src/scripts/**/*.jsx')
           .pipe(plumber(plumberOpt))
           .pipe(sourcemaps.init())
           .pipe(react())
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

gulp.task('less', function() {
    return gulp.src('bower_components/flat-ui/less/flat-ui.less')
           .pipe(plumber(plumberOpt))
           .pipe(less())
           .pipe(gulp.dest('public/styles/'))
           .pipe(livereload(lrPort));
});

gulp.task('serve', function() {
    var app = express();
    app.use(express.static('public'));
    app.use(express.static('bower_components/fui-angular'));
    app.use(express.static('bower_components/flat-ui'));
    app.use(express.static('bower_components'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.post('/data.json', function(req, res) {
        fs.readFile('data.json', 'utf8', function(err, data) {
            var json = JSON.parse(data);
            json.push(req.body);

            fs.writeFile('data.json', JSON.stringify(json), function(err) {
                res.setHeader('Cache-Control', 'no-cache');
                res.send(json);
            });
        });
    });  
    app.get('/data.json', function(req, res) {
        fs.readFile('data.json', function(err, data) {
            res.setHeader('Cache-Control', 'no-cache');
            res.json(JSON.parse(data));
        });
    });  
    app.listen(appPort);
    console.log('Serving site on http://' + location.hostname + ':' + appPort);
});

gulp.task('watch', function() {
    livereload.listen(lrOpt);
    console.log('Reload server started on http://' + lrOpt.host + ':' + lrOpt.port);
    gulp.watch('src/assets/**/*', ['assets']);
    gulp.watch('src/vendor/**/*', ['vendor']);
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/scripts/**/*.js', ['scripts', 'html', 'jade']);
    gulp.watch('src/styles/**/*.css', ['styles', 'html', 'jade']);
    gulp.watch('src/**/*.jade', ['jade']);
    gulp.watch('src/styles/**/*.styl', ['stylus', 'html', 'jade']);
    gulp.watch('src/scripts/**/*.coffee', ['coffee','html', 'jade']);
    gulp.watch('src/scripts/**/*.jsx', ['react','html','jade']);
    gulp.watch('bower_components/flat-ui/less/**/*', ['less', 'html', 'jade']);
});

gulp.task('default', ['clean',
                      'less',
                      'html',
                      'jade',
                      'scripts',
                      'coffee',
                      'react',
                      'styles',
                      'stylus',
                      'extern',
                      'serve',
                      'watch']);
