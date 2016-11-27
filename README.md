# archie
archie the architect. a front end build tool.

## Installation

1. Install gulp-cli

```bash
npm rm -g gulp
npm install -g gulp-cli
gulp -v
# CLI version 1.2.1
```

2. Install local NPM packages:

```bash
npm install -g gulp-cli
npm install --save-dev 'gulpjs/gulp#4.0' gulp-pug gulp-load-plugins gulp-plumber gulp-\if gulp-sourcemaps gulp-stylus gulp-sass gulp-autoprefixer gulp-size browser-sync gulp-data front-matter gulp-rename del minimist gulp-cached gulp-remember gulp-bump
```

```js
function test() {
    console.log('test');
}
```

## Usage

<!-- Testing 123 -->

### `gulp` task

_Purpose:_
Builds and watches pug and stylus.

_Configuration:_
Configuration is set in `gulp.config.js`. Any configuration property can be overridden by passing parameters to the `gulp` command. For example:

```bash
gulp --src=./src/ --dest=./build/ --css.enabled=css --css.src=./src/css/**/*.css
```

```js
function test() {
    console.log('testing');
}
```

### `gulp bump` task

__Purpose:__
Bump app version.

_Configuration:_

**`--type`**

*Type*: `string`
Default: `patch`
Options: `patch` | `minor` | `major`

**`--src`**

Type: `glob`

src file(s) to bump (i.e., `['package.json', 'bower.json']`)

**`--dest`**

Type: `glob`

destination directory to place updated src files.
