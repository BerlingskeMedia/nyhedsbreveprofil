const gulp = require('gulp');
const spawn = require('child_process').spawn;
const less = require('gulp-less');
const path = require('path');

var server, opdateringWebpack, mineDataWebpack;

gulp.task('default', ['less:watch', 'server', 'start_opdatering', 'start_mine_data']);
gulp.task('build', ['less', 'build_opdatering', 'build_mine_data']);


gulp.task('start_server', function() {
  if (server) {
    server.kill();
  }
  server = spawn('node', ['./server/index.js'], {stdio: 'inherit'});
});


gulp.task('server', ['start_server'], function () {
  gulp.watch(['./server/**.js'], ['start_server']);
});


gulp.task('less', function () {
  return gulp.src('./nyhedsbreve/assets/less/main.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./nyhedsbreve/assets/styles'));
});


gulp.task('less:watch', function () {
  gulp.watch('./nyhedsbreve/assets/less/**/*.less', ['less']);
});


gulp.task('start_opdatering', function() {
  if (opdateringWebpack) {
    opdateringWebpack.kill();
  }
  opdateringWebpack = spawn('webpack', ['--watch', '--config', 'webpack.opdatering.config.js'], {stdio: 'inherit'});
});


gulp.task('build_opdatering', function() {
  spawn('webpack', ['--progress', '--config', 'webpack.opdatering.config.js'], {stdio: 'inherit'});
});


gulp.task('start_mine_data', function() {
  if (mineDataWebpack) {
    mineDataWebpack.kill();
  }
  mineDataWebpack = spawn('webpack', ['--watch', '--config', 'webpack.mine-data.config.js'], {stdio: 'inherit'});
});


gulp.task('build_mine_data', function() {
  spawn('webpack', ['--progress', '--config', 'webpack.mine-data.config.js'], {stdio: 'inherit'});
});
