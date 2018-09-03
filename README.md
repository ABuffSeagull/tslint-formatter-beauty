# tslint-formatter-beauty

Beautiful TSLint formatter.

![](screenshot.png)

![build](https://flat.badgen.net/travis/g-plane/tslint-formatter-beauty)
![npm](https://flat.badgen.net/npm/v/tslint-formatter-beauty)

## Installation

Using Yarn:

```
yarn add --dev tslint-formatter-beauty
```

Using npm:

```
npm install --save-dev tslint-formatter-beauty
```

## Usage

### TSLint CLI:

```
tslint --formatters-dir ./node_modules/tslint-formatter-beauty -t beauty -p .
```

### gulp-tslint

```js
const gulp = require('gulp')
const tslint = require('gulp-tslint')

gulp.task('lint', () =>
  gulp.src('file.ts')
    .pipe(tslint({
      formattersDirectory: 'node_modules/tslint-formatter-beauty',
      formatter: 'beauty'
    }))
)
```

### tslint-loader

```js
module.exports = {
  // ... other options
  module: {
    rules: [
      // ... other options
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'tslint-loader',
        options: {
          formattersDirectory: 'node_modules/tslint-formatter-beauty',
          formatter: 'beauty'
        }
      }
    ]
  }
}
```

## Related Projects

- [eslint-formatter-beauty](https://github.com/g-plane/eslint-formatter-beauty)

## License

MIT License

Copyright (c) 2018-present Pig Fang
