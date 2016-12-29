# Mongoose Auto-Increment

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]

Mongoose plugin for auto-increment number ID.

## Install

```bash
npm install --save mongoose-autoincrement
```

## Usage

```js
var mongoose = require('mongoose');
var autoincrement = require('mongoose-autoincrement');

mongoose.plugin(autoincrement);
```

## License

MIT © [Samir Djellil](http://samirdjellil.com)

[npm-image]: https://img.shields.io/npm/v/mongoose-autoincrement.svg?style=flat-square
[npm-url]: https://npmjs.org/package/mongoose-autoincrement
[travis-image]: https://img.shields.io/travis/saamo/mongoose-autoincrement/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/saamo/mongoose-autoincrement
