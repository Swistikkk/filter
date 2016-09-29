var gulp = require('gulp');
var scss = require('gulp-sass');
var browserSync = require('browser-sync');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var through = require('through2');
//emmet-lifestyle - плагин, для записывания изменений из консоли сразу в код


function logFileHelpers() {
    return through.obj((file, enc, cb) => {
        console.log(file.babel.usedHelpers);
        cb(null, file);
    });
}

gulp.task('scss', function(){
  return gulp.src('app/scss/main.scss')
   .pipe(scss(
     //{outputStyle: 'compressed'}
   ).on('error', scss.logError))
   .pipe(gulp.dest('app/css'));
});

gulp.task('browser-sync', function(){
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false
  });
});

gulp.task('babel', function(){
  return gulp.src('app/js/app.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .on('error', console.error.bind(console))
    .pipe(concat("build.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest('app/js/'));
});

gulp.task('watch', ['browser-sync', 'babel'], function(){
  gulp.watch('app/scss/**/*.scss', ['scss']);
  gulp.watch('app/css/**/*.css', browserSync.reload);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch(['!app/js/build.js', '!app/js/build.js.map', 'app/js/**/*.js'], ['babel']);
  gulp.watch('app/js/*.js', browserSync.reload);
});

gulp.task('default', ['watch']);
