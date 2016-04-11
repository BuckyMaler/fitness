var gulp = require('gulp'),
		sass = require('gulp-sass'),
		autoprefix = require('gulp-autoprefixer'),
		jsHint = require('gulp-jshint'),
		uglify = require('gulp-uglify'),
		imageMin = require('gulp-imagemin'),
		cache = require('gulp-cache'),
		plumber = require('gulp-plumber'),
		rename = require('gulp-rename'),
		del = require('del'),
		browserSync = require('browser-sync').create();
		
gulp.task('html', function() {
	return gulp
		.src('*.html')
		.pipe(gulp.dest('dist'));
});

gulp.task('styles', function() {
	return gulp
		.src('assets/css/main.sass')
		.pipe(plumber({
			errorHandler: function (error) {
				console.log(error.message);
				this.emit('end');
			}
		}))
		.pipe(sass({outputStyle: 'expanded'}))
		.pipe(autoprefix())
		.pipe(gulp.dest('dist/assets/css'))
		.pipe(rename({suffix: '.min'}))
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(gulp.dest('dist/assets/css'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts', function() {
	return gulp
		.src('assets/js/functions.js')
		.pipe(plumber({
			errorHandler: function (error) {
				console.log(error.message);
				this.emit('end');
			}
		}))
		.pipe(jsHint())
    .pipe(jsHint.reporter('default'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('dist/assets/js'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('images', function() {
	return gulp
		.src('assets/img/*')
		.pipe(cache(imageMin({ optimizationLevel: 5, progressive: true, interlaced: true })))
		.pipe(gulp.dest('dist/assets/img'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('icons', function() {
	return gulp
		.src('assets/css/1-tools/fonts/*')
		.pipe(gulp.dest('dist/assets/css/fonts'));
});

gulp.task('serve', function() {
	browserSync.init({
		notify: false,
		server: {
			baseDir: 'dist/'
		}
	});
});

gulp.task('clean', function() {
	return del(['dist/assets/**']);
});

gulp.task('default', ['html', 'styles', 'scripts', 'images', 'icons'], function() {
	gulp.watch('*.html', ['html']).on('change', browserSync.reload);
	gulp.watch(['assets/css/**/*.sass',
						'assets/css/**/*.scss'],['styles']);
	gulp.watch('assets/js/*.js', ['scripts']);
	gulp.watch('assets/img/*', ['images']);
	gulp.start('serve');
});
