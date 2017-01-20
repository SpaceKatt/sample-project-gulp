var gulp = require('gulp')
var standard = require('gulp-standard')
var uglify = require('gulp-uglify')
var concat = require('gulp-concat')
var less = require('gulp-less')
var minifyCSS = require('gulp-cssnano')
var prefix = require('gulp-autoprefixer')
var del = require('del')
var bSync = require('browser-sync')

gulp.task('clean', function () {
  return del(['dist'])
})

gulp.task('styles', function () {
  return gulp.src('app/styles/main.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(prefix())
    .pipe(gulp.dest('dist/styles'))
})

gulp.task('test', function () {
  return gulp.src(['app/scripts/**/*.js', '!app/scripts/vendor/**/*.js'])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true,
      quiet: true
    }))
})

gulp.task('scripts',
  gulp.series('test', function scriptsInternal () {
    return gulp.src('app/scripts/**/*.js')
      .pipe(concat('main.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('dist/scripts'))
  })
)

gulp.task('server', function (done) {
  bSync({
    server: {
      baseDir: ['dist', 'app']
    }
  })
  done()
})

gulp.task('default',
  gulp.series('clean',
    gulp.parallel('styles', 'scripts'),
    'server',
    function watcher (done) {
      gulp.watch(
        ['app/scripts/**/*.js', '!app/scripts/vendor/**/*.js'],
        gulp.parallel('scripts')
      )
      gulp.watch(
        ['app/styles/**/*.less']
      )
      gulp.watch(
        'dist/**/*',
        bSync.reload
      )
      done()
    }
  )
)
