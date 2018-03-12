/* jshint node:true */

'use strict';

var main = require('./lib/main');
var IntlMessageFormat = main['default'];
var stringBuilderFactory = main.stringBuilderFactory;
var arrayBuilderFactory = main.arrayBuilderFactory;
var stringFormatFactory = main.stringFormatFactory;
var StringFormat = main.StringFormat;
var BuilderContext = main.BuilderContext;

// Add all locale data to `IntlMessageFormat`. This module will be ignored when
// bundling for the browser with Browserify/Webpack.
require('./lib/locales');

// Re-export `IntlMessageFormat` as the CommonJS default exports with all the
// locale data registered, and with English set as the default locale. Define
// the `default` prop for use with other compiled ES6 Modules.
exports = module.exports = IntlMessageFormat;
exports['default'] = exports;
exports.stringBuilderFactory = stringBuilderFactory;
exports.arrayBuilderFactory = arrayBuilderFactory;
exports.stringFormatFactory = stringFormatFactory;
exports.StringFormat = StringFormat;
exports.BuilderContext = BuilderContext;