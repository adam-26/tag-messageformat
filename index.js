/* jshint node:true */

'use strict';

var IntlMessageFormat = require('./lib/main')['default'];
var StringBuilderFactory = require('./lib/messageBuilders').StringBuilderFactory;
var ArrayBuilderFactory = require('./lib/messageBuilders').ArrayBuilderFactory;

// Add all locale data to `IntlMessageFormat`. This module will be ignored when
// bundling for the browser with Browserify/Webpack.
require('./lib/locales');

// Re-export `IntlMessageFormat` as the CommonJS default exports with all the
// locale data registered, and with English set as the default locale. Define
// the `default` prop for use with other compiled ES6 Modules.
exports = module.exports = IntlMessageFormat;
exports['default'] = exports;
exports.StringBuilderFactory = StringBuilderFactory;
exports.ArrayBuilderFactory = ArrayBuilderFactory;