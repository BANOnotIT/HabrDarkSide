const stylelint = require('gulp-stylelint')
const sourcemaps = require('gulp-sourcemaps')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const gulp = require('gulp')
const cssnano = require('gulp-cssnano')

sass.compiler = require('node-sass')


function lint() {
    return gulp.src('src/main.sass')
        .pipe(sourcemaps.init())
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(stylelint({
            reporters: [
                {formatter: 'string', console: true}
            ]
        }))
}

function build() {
    return gulp.src('src/main.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(cssnano())
        .pipe(rename({extname: '.user.css'}))
        .pipe(gulp.dest('dist'))
}

exports.lint = lint
exports.default = build
