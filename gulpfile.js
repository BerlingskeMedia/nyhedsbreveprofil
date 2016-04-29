var gulp = require('gulp');
    spawn = require('child_process').spawn,
    less = require('gulp-less'),
    path = require('path');

gulp.task('default', ['less:watch', 'server', 'start_webpack']);
gulp.task('build', ['less']);

var node;

gulp.task('start_server', function() {
  if (node) {
    node.kill();
  }
  node = spawn('node', ['./src/server.js'], {stdio: 'inherit'});
});

gulp.task('server', ['start_server'], function () {
  gulp.watch(['./src/**.js'], ['start_server']);
});


gulp.task('less', function () {
  return gulp.src('./assets/less/main.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./assets/styles'));
});

gulp.task('less:watch', function () {
  gulp.watch('./assets/less/**/*.less', ['less']);
});

var webpack;

gulp.task('start_webpack', function() {
  if (webpack) {
    webpack.kill();
  }
  webpack = spawn('webpack', ['--watch'], {stdio: 'inherit'});
});
