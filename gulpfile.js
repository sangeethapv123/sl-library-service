/**
 * name : gulpfile.js.
 * author : Aman Karki.
 * created-date : 20-July-2020.
 * Description : Gulp file for apidoc .
 */

let gulp = require("gulp");
let apidoc = require("gulp-apidoc");

gulp.task("apidoc", (done) => {
    apidoc({
        src: "./controllers",
        dest: "./public/apidoc"
    }, done);
});

gulp.task("watch", () => {
    gulp.watch(["./controllers/**"], ["apidoc"]);
});
