var gulp = require('gulp');
  spawn = require('child_process').spawn,
  less = require('gulp-less'),
  path = require('path');

gulp.task('default', ['less:watch', 'server', 'start_opdatering', 'start_mine_data']);
gulp.task('build', ['less']);

var node, opdateringWebpack, mineDataWebpack;

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

gulp.task('start_opdatering', function() {
  if (opdateringWebpack) {
    opdateringWebpack.kill();
  }
  opdateringWebpack = spawn('webpack', ['--watch', '--config', 'webpack.opdatering.config.js'], {stdio: 'inherit'});
});

gulp.task('start_mine_data', function() {
  if (mineDataWebpack) {
    mineDataWebpack.kill();
  }
  mineDataWebpack = spawn('webpack', ['--watch', '--config', 'webpack.mine-data.config.js'], {stdio: 'inherit'});
});
