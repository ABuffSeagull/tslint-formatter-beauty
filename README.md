# tslint-formatter-kakoune

[TSLint](https://palantir.github.io/tslint/)
formatter that follows
[kakoune](https://github.com/mawww/kakoune/blob/master/rc/base/lint.kak)
format:

```
{filename}:{line}:{column}: {kind}: {message}
```

## Installation

Using npm:

```
npm install --save-dev tslint-formatter-kakoune
```

## Usage

### TSLint CLI:

```
tslint --formatters-dir ./node_modules/tslint-formatter-kakoune -t kakoune -p .
```

In your `kakrc`:
```
hook global WinSetOption filetype=typescript %{
  set buffer lintcmd 'tslint --config tslint.json --formatters-dir ./node_modules/tslint-formatter-kakoune -t kakoune'
  lint-enable
  lint
}
```
You may add more hooks to trigger the lint command on save.
