# Underline

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Appveyor status][appveyor-image]][appveyor-url]
[![Coverage Status][coveralls-image]][coveralls-url]

A simple tool for generating friendly error message.

## Quick start

```terminal
npm install node-underline
```

```javascript
const underline = require('node-underline');
const string = `const perLineList = str.split(nlRE);
               const len = perLineList.length;
               let i = 0;
               let lineCount = 0;
               while(i < len) {
                 const currentLine = perLineList[i];
                 i++;
               }` 
const result = underline(string, 104, 113);
console.log(result.text);
```

print

```terminal
3       let i = 0;
4       let lineCount = 0;
5       while(i < len) {
             ^^^^^^^^^
6         const currentLine = perLineList[i];
7         i++;
8       }
```


## Author

wanghx

## License
MIT

[npm-url]: https://npmjs.org/package/node-underline
[npm-image]: http://img.shields.io/npm/v/node-underline.svg
[travis-url]: https://travis-ci.org/whxaxes/underline
[travis-image]: http://img.shields.io/travis/whxaxes/underline.svg
[appveyor-url]: https://ci.appveyor.com/project/whxaxes/underline/branch/master
[appveyor-image]: https://ci.appveyor.com/api/projects/status/github/whxaxes/underline?branch=master&svg=true
[coveralls-url]: https://coveralls.io/r/whxaxes/underline
[coveralls-image]: https://img.shields.io/coveralls/whxaxes/underline.svg

