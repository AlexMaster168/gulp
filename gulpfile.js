//Подключаем модули галпа
const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const image = require('gulp-image');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();

//Порядок подключения css файлов
const cssFiles = [
    './src/css/main.css',
    './src/css/media.css'
]
    //Порядок подключения js файлов
const jsFiles = [
    './src/js/lib.js',
    './src/js/main.js'
]
//Порядок подключения html файлов
const htmlFiles = [
    'index.html'
]
const images = [
    './Картинки/a3a26cf09f355c2e1da4cd08fc7d2b83.png',
    './Картинки/dd2732908e5f59670b3338eef9551bb4.jpg',
    './Картинки/prostoy-calendar-2020.gif',
    './Картинки/s.jpg',
    './Картинки/s2.jpg',
    './Картинки/s3.jpg'
]
//Таск на стили CSS
function styles() {
    //Шаблон для поиска файлов CSS
    //Всей файлы по шаблону './src/css/**/*.css'
return gulp.src(cssFiles)
    //Объединение файлов в один
    .pipe(concat('style.css'))
    //Минификация CSS
    .pipe(cleanCSS({compatibility: 'ie8'})
       )
    //Добавить префиксы
    .pipe(autoprefixer({
        cascade: false
    }))
    //Выходная папка для стилей
.pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
}
//Таск на скрипты JS
function scripts() {
    //Шаблон для поиска файлов JS
    //Всей файлы по шаблону './src/js/**/*.js'
    return gulp.src(jsFiles)
        //Объединение файлов в один
        .pipe(concat('script.js'))
        //Минификация JS
        .pipe(uglify({
            toplevel:true
        }))
        //Выходная папка для скриптов
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream());
}
function imagev() {
    gulp.src(images)
        .pipe(image())
        .pipe(rename({
            suffix:'.min',
            prefix:'img-',
            extname: ".png"
        }))
        .pipe(gulp.dest('./build/img'));
}
// Таск на Html
function html() {
    return gulp.src(htmlFiles)
        // Минификация Html
        .pipe(htmlmin({ collapseWhitespace: true }))

        //Выходная папка для скриптов
        .pipe(gulp.dest('.'))
}
//Удалить всё в указанной папке
function clean(){
    return del(["build/*"])
}
//Просматривать файлы
function watch(){
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    //Следить за CSS файлами
    gulp.watch('./src/css/**/*.css', styles)
    //Следить за JS файлами
    gulp.watch('./src/js/**/*.js', scripts)
    //При изменении HTML запустить синхронизацию
    gulp.watch("./*.html").on('change', browserSync.reload);
}
//Таск вызывающий функцию styles
gulp.task('styles1',styles);
//Таск вызывающий функцию scripts
gulp.task('scripts1',scripts);
//Таск Вызывающий функцию html
gulp.task('html',html);
//Таск для очистки папки build
gulp.task('del',clean);
//Таск для отслеживания изменений
gulp.task('watch', watch);
gulp.task("image",imagev);
gulp.task("del-image",gulp.series(clean,imagev))
//Таск для удаления файлов в папке build и запуск styles и scripts
gulp.task('build', gulp.series(clean, gulp.parallel(styles,scripts,html)));
//Таск запускает таск build и watch последовательно
gulp.task('dev', gulp.series('build','watch'));
