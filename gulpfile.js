(() => {

    'use strict';

    // use dotenv file for easy configuration changes
    require('dotenv').config();

    // get initial constants for the build (s.a. current mandant and build mode)
    const mandant  = process.env.mandant || 'swt_default';
    const devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() === 'development');

    // modules
    const
        browserSync = devBuild ? require('browser-sync').create() : null,
        concat = require('gulp-concat'),
        del = require('del'),
        gulp = require('gulp'),
        imagemin = require('gulp-imagemin'),
        minify = require('gulp-minify'),
        newer = require('gulp-newer'),
        order = require("gulp-order"),
        postcss = require('gulp-postcss'),
        sass = require('gulp-sass'),
        size = require('gulp-size'),
        sourcemaps = devBuild ? require('gulp-sourcemaps') : null;


    // directory locations
    const dir = {
        src: 'src/' + mandant + '/',
        build: 'build/' + mandant + '/',
        dist: mandant + '/static/'
    };

    // write configuration to console
    console.log('Gulp', devBuild ? 'development' : 'production', 'build');
    console.log('Mandant', mandant);

    /***********************************************************************************
     * JavaScript task
     ***********************************************************************************/
    const jsConfig = {
        src: ['node_modules/bootstrap/dist/js/bootstrap.js', dir.src + 'js/**/*.js'],
        bs: 'bootstrap.js',
        libs: 'lib/*.js',
        modules: 'modules/*.js',
        file: 'behaviour.js',
        watch: dir.src + 'js/**/*',
        build: dir.build + 'js/',
        dist: dir.dist + 'js/'
    };

    function buildJSForDev() {
        console.log(jsConfig.src);
        return gulp
            .src(jsConfig.src)
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(order([
                jsConfig.bs,
                jsConfig.libs,
                jsConfig.modules
            ]))
            .pipe(concat(jsConfig.file))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(jsConfig.build))
    }

    function buildJSForProd() {
        return gulp
            .src(jsConfig.src)
            .pipe(order([
                jsConfig.bs,
                jsConfig.libs,
                jsConfig.modules
            ]))
            .pipe(concat(jsConfig.file))
            .pipe(minify())
            .pipe(gulp.dest(jsConfig.dist))
    }

    exports.devJS = buildJSForDev;
    exports.prodJS = buildJSForProd;

    /***********************************************************************************
     * Styles task
     ***********************************************************************************/
    const cssConfig = {
        src: dir.src + 'scss/styles.scss',
        watch: dir.src + 'scss/**/*',
        build: dir.build + 'css/',
        dist: dir.dist + 'css/',
        sassOpts: {
            sourceMap: devBuild,
            imagePath: '/img/',
            precision: 3,
            errLogToConsole: true
        },
        postCSS: [
            require('postcss-assets')({
                loadPaths: ['img/'],
                basePath: dir.build
            }),
            require('autoprefixer')({
                browsers: ['> 1%']
            }),
            require('cssnano')
        ]
    };

    function buildStylesForDev() {
        return gulp.src(cssConfig.src)
            .pipe(sourcemaps ? sourcemaps.init() : noop())
            .pipe(sass(cssConfig.sassOpts).on('error', sass.logError))
            .pipe(postcss(cssConfig.postCSS))
            .pipe(sourcemaps ? sourcemaps.write() : noop())
            .pipe(size({showFiles: true}))
            .pipe(gulp.dest(cssConfig.build));
    }

    function buildStylesForProd() {
        return gulp.src(cssConfig.src)
            .pipe(sass(cssConfig.sassOpts).on('error', sass.logError))
            .pipe(postcss(cssConfig.postCSS))
            .pipe(size({showFiles: true}))
            .pipe(gulp.dest(cssConfig.dist));
    }

    exports.devCSS = buildStylesForDev;
    exports.prodCSS = buildStylesForProd;

    /***********************************************************************************
     * Copy assets and static markup task
     ***********************************************************************************/
    const assetConfig = {
        srcBuild: [dir.src + '*.html',dir.src + '**/*.eot', dir.src + '**/*.ttf', dir.src + '**/*.woff', dir.src + '**/*.woff2', dir.src + '**/*.svg', dir.src + '**/*.json'],
        srcDist: [dir.src + '**/*.eot', dir.src + '**/*.ttf', dir.src + '**/*.woff', dir.src + '**/*.woff2', dir.src + '**/*.svg', dir.src + '**/*.json'],
        build: dir.build,
        dist: dir.dist
    };

    function copyAssetsForDev() {
        return gulp.src(assetConfig.srcBuild)
            .pipe(gulp.dest(assetConfig.build));
    }

    function copyAssetsForProd() {
        return gulp.src(assetConfig.srcDist)
            .pipe(gulp.dest(assetConfig.dist));
    }

    exports.devCopyAssets = copyAssetsForDev;
    exports.prodCopyAssets = copyAssetsForProd;

    /***********************************************************************************
     * Clean task
     ***********************************************************************************/
    function cleanDevDir() {
        return del([dir.build]);
    }

    function cleanProdDir() {
        return del([dir.dist]);
    }

    exports.devClean = cleanDevDir;
    exports.prodClean = cleanProdDir;

    /***********************************************************************************
     * Images task:
     * - copy images to build directory
     * - optimize images for web
     ***********************************************************************************/
    const imgConfig = {
        src: dir.src + 'img/**/*',
        build: dir.build + 'img/',
        dist: dir.dist + 'img/',
        minOpts: {
            optimizationLevel: 5
        }
    };

    function prepareImagesForDev() {
        return gulp.src(imgConfig.src)
            .pipe(newer(imgConfig.build))
            .pipe(imagemin(imgConfig.minOpts))
            .pipe(size({showFiles: true}))
            .pipe(gulp.dest(imgConfig.build));
    }

    function prepareImagesForProd() {
        return gulp.src(imgConfig.src)
            .pipe(newer(imgConfig.dist))
            .pipe(imagemin(imgConfig.minOpts))
            .pipe(size({showFiles: true}))
            .pipe(gulp.dest(imgConfig.dist));
    }

    exports.devImg = prepareImagesForDev;
    exports.prodImg = prepareImagesForProd;

    /***********************************************************************************
     * watch task for dev only
     ***********************************************************************************/
    function watchForDev(cb) {

        // image changes
        gulp.watch(imgConfig.src,prepareImagesForDev);

        // CSS changes
        gulp.watch(cssConfig.watch, buildStylesForDev);

        // JS changes
        gulp.watch(jsConfig.watch, buildJSForDev);

        // asset and markup changes
        gulp.watch(assetConfig.srcBuild, copyAssetsForDev);
        cb();
    }

    exports.devWatch = watchForDev;

    /***********************************************************************************
     * local server task for dev only
     ***********************************************************************************/
    const syncConfig = {
        server: {
            baseDir: 'build/'+ mandant,
            index: 'index.html'
        },
        port: 8000,
        open: false
    };

    function serverForDev(cb) {
        if (browserSync) browserSync.init(syncConfig);
        cb();
    }

    exports.devServer = serverForDev;
    exports.devServer = gulp.series(watchForDev, serverForDev);

    /***********************************************************************************
     * local server task with automatic synced files for dev only
     ***********************************************************************************/
    const autoSyncConfig = {
        server: {
            baseDir: 'build/'+ mandant,
            index: 'index.html'
        },
        files: [cssConfig.build +'*.css', jsConfig.build +'*.js', dir.build +'*.html'],
        port: 8000,
        open: false
    };

    function serverAutoSyncForDev(cb) {
        if (browserSync) browserSync.init(autoSyncConfig);
        cb();
    }

    exports.devServerWithAutoSync = gulp.series(watchForDev, serverAutoSyncForDev);

    /***********************************************************************************
     * DEV Tasks: tasks for local development
     ***********************************************************************************/
    exports.DEV_auto = gulp.series(cleanDevDir, prepareImagesForDev, copyAssetsForDev, buildJSForDev, buildStylesForDev, watchForDev, serverForDev);
    exports.DEV_sync = gulp.series(cleanDevDir, prepareImagesForDev, copyAssetsForDev, buildJSForDev, buildStylesForDev, watchForDev, serverAutoSyncForDev);

    /***********************************************************************************
     * PRODUCTION Tasks: tasks for production build
     ***********************************************************************************/
    exports.PROD = gulp.series(cleanProdDir, prepareImagesForProd, copyAssetsForProd, buildJSForProd, buildStylesForProd);

    /***********************************************************************************
     * Default Task: series of  for initial development build
     ***********************************************************************************/
    exports.default = gulp.series(cleanDevDir, prepareImagesForDev, copyAssetsForDev, buildJSForDev, buildStylesForDev);

})();