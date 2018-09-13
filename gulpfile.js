const
    path = require('path'),
    gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    resolve = require('rollup-plugin-node-resolve'),
    commonJS = require('rollup-plugin-commonjs'),
    buble = require('rollup-plugin-buble'),
    rollup = require('gulp-better-rollup'),
    imagemin = require('gulp-imagemin'),
    htmlmin = require('gulp-htmlmin'),
    size = require('gulp-size'),
    browserSync = require('browser-sync')
    ;

let isRelease = false;

const destination = 'public';

let tasks = {
    html: {
        src: 'index.html',
        dest: destination,
        min: () => htmlmin({ collapseWhitespace: true, removeComments: true })
    },
    images: {
        src: 'images/**/*',
        dest: path.join(destination, 'resources'),
        min: imagemin
    },
    javascript: {
        src: 'js/game.js',
        dest: destination,
        fun: () => rollup({
            plugins: [
                buble({ transforms: { dangerousForOf: true, modules: false } }),
                resolve(),
                commonJS({ include: 'node_modules/**' }),
            ]
        }, 'cjs').on('error', e => console.log(JSON.stringify(e))),
        min: uglify
    }
};

function createTask(title) {
    let task = tasks[title];

    let gulpTask = gulp.src(task.src);

    if (task.fun)
        gulpTask = gulpTask.pipe(task.fun());

    if (isRelease && task.min)
        gulpTask = gulpTask.pipe(task.min());

    gulpTask = gulpTask.pipe(size({ pretty: true, title }));

    return gulpTask.pipe(gulp.dest(task.dest)).on('error', console.log);
}

gulp.task('html', function () {
    return createTask('html');
});

gulp.task('favicon', function () {
    return gulp.src('frontend/favicon.ico').pipe(gulp.dest(destination));
});

gulp.task('images', ['favicon'], function () {
    return createTask('images');
});

gulp.task('javascript', function () {
    return createTask('javascript');
});

gulp.task('clean', function () {
    return del(destination + '/**/*');
});

gulp.task('build', ['html', 'javascript', 'images']);

gulp.task('release', ['clean'], function () {
    isRelease = true;

    return gulp.start(['build']);
});

gulp.task('watch', ['build'], function () {
    gulp.watch('js/**/*.js', ['javascript']);
    gulp.watch('index.html', ['html']);
    gulp.watch('images/**/*', ['images']);
});

gulp.task('dev', ['build'], function () {

    browserSync.init({
        open: false,
        watch: true,
        port: 8080,
        server: destination
    });

    gulp.watch('js/**/*.js', ['javascript']);
    gulp.watch('index.html', ['html']);
    gulp.watch('images/**/*', ['images']);
});
