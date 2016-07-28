'use strict';

var gulp = require("gulp");
var fs = require("fs");
var packageJSON = JSON.parse(fs.readFileSync('./package.json'));

var themeDirectory = packageJSON._where;
var assetsFolder = themeDirectory + "/assets/scss/modules/";
var moduleFolder = themeDirectory + "/node_modules/" + packageJSON._location + "/dist/scss/carousel.scss"

gulp.src(moduleFolder)
  .pipe(gulp.dest(assetsFolder));

var themeFile = themeDirectory + "/assets/scss/theme.scss";
var data = "\r\n @import \"modules/carousel.scss\""

fs.appendFile(themeFile, data, (err) => {
    if (err) throw err;
    console.log('Unable to append import to theme.scss');
  });
