'use strict';

var browserify = require('browserify');
var browserSync = require('browser-sync');
var del = require('del');
var gulp = require('gulp');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var reload = browserSync.reload;
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var wait = require('gulp-wait');
var watchify = require('watchify');

var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');

var cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

var babelify = require('babelify');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');


// Setup your Configuration
var paths = {
  'stylesheetsEntryPoint': 'source/stylesheets/all.scss',
  'stylesheets': 'source/stylesheets/**/*.scss',
  'stylesheetsDist': './dist/stylesheets',

  'fontsEntryPoint': '/source/stylesheets/fonts/**.*',
  'fontsDist': 'dist/css/fonts',

  'views': 'source/**/*.erb',

  'imageEntryPoint': 'source/images/**/*.+(png|jpg|jpeg|gif|svg)',
  'imageDist': './dist/images',

  'javascriptMainFile': 'all.js',
  'javascriptsEntryPoint': './source/javascripts/',
  'javascriptsDist': './dist/javascripts/'
  // 'buildFolder': 'build'
};

/*
  Styles Task
*/

gulp.task('stylesheets',function() {
  // move over fonts
  gulp.src(paths.fontsEntryPoint)
    .pipe(gulp.dest(paths.fontsDist))

  // Compiles CSS
  var postCssPlugins = [ // add PostCssPlugins
  ];

  gulp.src(paths.stylesheetsEntryPoint)  // take all.scss only
      .pipe(sass({
          includePaths: require('node-bourbon').includePaths,
          includePaths: require('node-neat').includePaths
        }).on('error', sass.logError))
      //.pipe(postcss(postCssPlugins)) // use Postcss Plugins
    .pipe( autoprefixer( 'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
     //.pipe(gulp.dest(paths.buildFolder + '/stylesheets')) // build new folder
    .pipe(gulp.dest(paths.stylesheetsDist))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.stylesheetsDist))
    .pipe(wait(1000))
    .pipe(reload({stream:true}))
    .pipe(notify({ message: 'Stub: Styles task complete' }));
});

/*
  Images
*/
gulp.task('images', function() {
  gulp.src(paths.imageEntryPoint)
    .pipe(cache(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        interlaced: true, // GIFs by setting the interlaced option key to true
        use: [pngquant()]
    })))
    .pipe(gulp.dest(paths.imageDist))
    .pipe(reload({stream:true}))
    .pipe(notify({ message: 'Stub: Image Update Successfully' }));
});

/*
  Browser Sync
*/
gulp.task('browser-sync', function(){
  browserSync.init({
     proxy: "localhost:4567"
  });
});

/*
  Cleaning Image & callback Image
*/
gulp.task('clean:dist', function() {
  return del.sync([paths.imgDst]);
});

gulp.task('callbackImg', function(callback) {
  runSequence(
    'clean:dist',
    ['images'],
    callback
  )
})

/*
 Scripts
*/
function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

function buildScript(file, watch) {
  var props = {
    entries: [paths.javascriptsEntryPoint + file],
    debug : true,
    cache: {},
    packageCache: {},
    transform:  [babelify.configure({stage : 0 })]
  };

  // watchify() if watch requested, otherwise run browserify() once
  var bundler = watch ? watchify(browserify(props)) : browserify(props);

  function rebundle() {
    var stream = bundler.bundle();
    return stream
      .on('error', handleErrors)
      .pipe(source(file))
      .pipe(gulp.dest(paths.javascriptsDist))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(rename('all.min.js'))
      .pipe(gulp.dest(paths.javascriptsDist))
      .pipe(wait(1000))
      .pipe(reload({stream:true}))
      .pipe(notify({ message: 'Stub: Scripts task complete' }));
  }

  // listen for an update and run rebundle
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });

  // run it once the first time buildScript is called
  return rebundle();
}

gulp.task('scripts', function() {
  return buildScript(paths.javascriptMainFile, false); // this will run once because we set watch to false
});

// run 'scripts' task first, then watch for future changes
gulp.task('watch',['images','stylesheets', 'scripts', 'browser-sync'], function() {
  gulp.watch(paths.stylesheets, ['stylesheets']); // gulp watch for sass changes

  gulp.watch([paths.views], function (e){ // gulp watch for erb changes
        gulp.src(e.path)
        .pipe(wait(1000))
        .pipe(reload({stream:true}));
  });

  gulp.watch([paths.imageEntryPoint], function (callback){ // gulp watch for image changes
        gulp.src(callback.path)
        gulp.run('callbackImg');
  });

  return buildScript(paths.javascriptMainFile, true); // browserify watch for JS changes
});

