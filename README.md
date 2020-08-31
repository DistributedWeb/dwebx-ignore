# dwebx-ignore

> default ignore for dwebx

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

Check if a file should be ignored for DWebX:

* Ignore `.dwebx` by default
* Use the `.dwebxignore` file
* Optionally ignore all hidden files
* Add in other custom ignore matches

## Install

```
npm install dwebx-ignore
```

## Usage

```js
var datIgnore = require('dwebx-ignore')
var ignore = datIgnore('/data/dir')

console.log(ignore('.dwebx')) // true
console.log(ignore('.git')) // true
console.log(ignore('dwebx-data')) // false
console.log(ignore('cat.jpg')) // false
```

Uses [anymatch](https://github.com/es128/anymatch) to match file paths.

### Example Options

Common configuration options.

#### Add custom ignore

```js
var ignore = datIgnore('/data/dir', {
    ignore: [
      '**/node_modules/**', 
      'path/to/file.js',
      'path/anyjs/**/*.js'
    ]
  })
```

#### Allow Hidden Files

```js
var ignore = datIgnore('/data/dir', { ignoreHidden: false })
```

####  Change DWebX Ignore Path

```js
var ignore = datIgnore('/data/dir', {
    datignorePath: '~/.dwebxignore'
  })
```

#### `.dwebxignore` as string/buffer

Pass in a string as a newline delimited list of things to ignore.

```js
var datIgnoreFile = fs.readFileSync('~/.dwebxignore')
datIgnoreFile += '\n' + fs.readFileSync(path.join(dir, '.dwebxignore'))
datIgnoreFile += '\n' + fs.readFileSync(path.join(dir, '.gitignore'))

var ignore = datIgnore('/data/dir', { dwebxignore: datIgnoreFile })
```

## API

### `var ignore = datIgnore(dir, [opts])`

Returns a function that checks if a path should be ignored:

```js
ignore('.dwebx') // true
ignore('.git') // true
ignore('data/cats.csv') // false
```

#### `dir`

`dir` is the file root to compare to. It is also used to find `.dwebxignore`, if not specified.

#### Options:

* `opts.ignore` - Extend custom ignore with any anymatch string or array.
* `opts.useDatIgnore` - Use the `.dwebxignore` file in `dir` (default: true)
* `opts.ignoreHidden` - Ignore all hidden files/folders (default: true)
* `opts.datignorePath` - Path to `.dwebxignore` file (default: `dir/.dwebxignore`)
* `opts.dwebxignore` - Pass `.dwebxignore` as buffer or string

## License

[MIT](LICENSE.md)

[npm-image]: https://img.shields.io/npm/v/dwebx-ignore.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/dwebx-ignore
[travis-image]: https://img.shields.io/travis/datproject/dwebx-ignore.svg?style=flat-square
[travis-url]: https://travis-ci.org/datproject/dwebx-ignore
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard
