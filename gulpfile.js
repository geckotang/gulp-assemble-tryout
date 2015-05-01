//npm modules
var gulp         = require('gulp');
var extname      = require('gulp-extname');
var gulpAssemble = require('gulp-assemble');
var watch        = require('gulp-watch');
var plumber      = require('gulp-plumber');
var notify       = require('gulp-notify');
var assemble     = require('assemble');
var browserSync  = require('browser-sync');

//setting
var assembleSetting = {
  all           : __dirname + '/templates/**/*.*',
  data          : __dirname + '/templates/data/*.yml',
  layouts       : __dirname + '/templates/layouts/*.hbs',
  partials      : __dirname + '/templates/partials/*.hbs',
  pages         : __dirname + '/templates/pages/*.hbs',
  layoutdir     : __dirname + '/templates/layouts',
  dist          : __dirname + '/dist',
  defaultLayout : 'default'
};

gulp.task('assemble', function () {
  //throw custom data from gulpfile to template
  assemble.data({
    myData: 'HOGEHOGE'
  });
  //throw custom partial from gulpfile to template
  assemble.partial('banner', { content: 'this is banner' });
  //assemble settings
  assemble.option({
    production : true,
    layoutdir  : [assembleSetting.layoutdir],
    layout     : assembleSetting.defaultLayout
  });
  assemble.data([assembleSetting.data]);
  assemble.layouts([assembleSetting.layouts]);
  assemble.partials(assembleSetting.partials);
  return gulp.src(assembleSetting.pages)
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(gulpAssemble(assemble))
    .pipe(extname())
    .pipe(gulp.dest(assembleSetting.dist));
});

gulp.task('server', ['assemble'], function() {
	browserSync({
    server: {
      baseDir : __dirname + '/dist'
    }
  });
  watch([assembleSetting.all], function(event){
    gulp.start(['assemble'], browserSync.reload);
  });
});

gulp.task('default', ['assemble']);
