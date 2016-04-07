# Stub Middleman Kit

This is an Middleman static websites framework with Gulp as automatic workflow.

A Starter Kit for front-end development, it contains:
 - [Middleman](https://middlemanapp.com/) Build static websites with an easy-to-use framework
 - [Gulp](https://github.com/gulpjs/gulp) for asset bundling (JS/CSS/Fonts/Sass/images) with Browser-sync
 - [Browser-sync](https://github.com/BrowserSync/browser-sync) Keep multiple browsers & devices in sync when building websites
 - [Babel](https://babeljs.io/) 6 for EcmaScript 2015 / ES6 support
 - [PostCSS](https://github.com/postcss/postcss) PostCSS is a tool for transforming styles with JS plugins
 - [CSSnano](https://github.com/ben-eb/gulp-cssnano) Minify CSS with cssnano
 - [UglifyJS](https://github.com/mishoo/UglifyJS2) A JavaScript parser, minifier, compressor or beautifier toolkit
 - [Imagemin](https://github.com/imagemin/imagemin) Minify PNG, JPEG, GIF and SVG images
 - [pngquant](https://github.com/pornel/pngquant) Lossy PNG compressor
 - [Normalize](https://necolas.github.io/normalize.css/) A modern, HTML5-ready alternative to CSS resets
 - [Bourbon](https://github.com/thoughtbot/bourbon) Mixin library for Sass
 - [Neat](https://github.com/thoughtbot/neat) Semantic grid framework for Sass
 - erb as a template engine for app views
 - gulp integration through middleman's [external asset pipeline](https://middlemanapp.com/advanced/external-pipeline)

## Architecture

    name-project/
    ├── dist/
    │    └── ...
    │
    └── source/
         ├── images/
         │
         ├── javascripts/
         │      └── all.js
         │
         ├── layouts/
         │      └── layout.erb
         │
         ├── stylesheets/
         │      ├── compoments/
         │      ├── pages/
         │      │     ├── _home.scss
         │      │     └── _index.scss
         │      ├── utils/
         │      │     ├── _normalize.scss
         │      │     └── _index.scss
         │      └── all.scss
         │
         └── index.html.erb
         
## Installation Stub Middleman Kit

Using templates with Middleman is incredibly easy, you just need to reference
the repository for the template in the ``--template`` flag when you call
``middleman init``. It looks like this:

```
middleman init name-project --template=stub4ever/stub-middleman-kit
```

Once you have the middleman project you will need to install the npm
dependencies. You will need Node.js and npm on your system.

```
cd name-project
npm install
```

Now you can simply run $``middleman``. This will start the BrowserSync proxy
and it will open for you. You can then edit your stylesheets, images, javascript and views and your
browser will automatically reload on all devices.

## Exporting the Static Site

Finally, when you are ready to deliver static code or, in the case of "blog mode", host a static blog, you will need to build the site. Using the command-line, from the project folder, run $ ``middleman build``:

```
cd name-project
bundle exec middleman build
```

## Deploying the site

A very handy tool to deploy a build is $ ``middleman-deploy``. It can deploy a site via rsync, ftp, sftp, or git.

```
middleman build [--clean]
middleman deploy [--build-before]
```

## Contributing
If you have problems, please create a [GitHub Issue](https://github.com/stub4ever/stub-middleman-kit/issues).
Have a fix or want to add a feature? [Pull Requests](https://github.com/stub4ever/stub-middleman-kit/pulls) are welcome!



