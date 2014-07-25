var gulp = require('gulp')
    install = require('gulp-install')
    conflict = require('gulp-conflict')
    template = require('gulp-template')
    inquirer = require('inquirer');

gulp.task('default', function (done){
    inquirer.prompt([
        {type: 'input', name: 'name', message: 'App directory name:', default: 'bottle'},
        {type: 'confirm', name: 'moveon', message: 'Continue?'}
    ],
    function (answers) {
        if (!answers.moveon) {
            return done();
        }
        var dest = './' + answers.name + '/';
        gulp.src(__dirname + '/templates/**')
            .pipe(template(answers.name))
            .pipe(conflict(dest))
            .pipe(gulp.dest(dest))
            .pipe(install())
            .on('finish', function () {
                done();
            });
    });
});
