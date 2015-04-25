// Generated on 2015-04-24 using generator-bookmarklet 1.2.0
'use strict';

var buffer = require('buffer'),
    del = require('del'),
    gulp = require('gulp'),
    gulpUglify = require('gulp-uglify'),
    map = require('map-stream');

gulp.task('scripts', function () {
  var header = new Buffer('// Copy this to your URL bar:\njavascript:');

  gulp.src('./jewsgen.js')
    .pipe(gulpUglify()).on('error', function () {})
    .pipe(map(function (file, cb) {
      file.contents = buffer.Buffer.concat([header, file.contents]);
      cb(null, file);
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, 'dist'));

gulp.task('default', ['scripts']);

gulp.task('watch', ['scripts'], function () {
  gulp.watch('./jewsgen.js', ['scripts']);
});
