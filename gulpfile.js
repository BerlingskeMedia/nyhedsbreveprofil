var gulp = require('gulp');
    spawn = require('child_process').spawn;

gulp.task('default', ['server']);

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