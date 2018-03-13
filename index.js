/* jshint node:true */

'use strict';

var main = require('./lib/main');
var TagMessageFormat = main['default'];
var stringBuilderFactory = main.stringBuilderFactory;
var arrayBuilderFactory = main.arrayBuilderFactory;
var stringFormatFactory = main.stringFormatFactory;
var StringFormat = main.StringFormat;
var BuilderContext = main.BuilderContext;

// Add all locale data to `TagMessageFormat`. This module will be ignored when
// bundling for the browser with Browserify/Webpack.
require('./lib/locales');

// Re-export `TagMessageFormat` as the CommonJS default exports with all the
// locale data registered, and with English set as the default locale. Define
// the `default` prop for use with other compiled ES6 Modules.
exports = module.exports = TagMessageFormat;
exports['default'] = exports;
exports.stringBuilderFactory = stringBuilderFactory;
exports.arrayBuilderFactory = arrayBuilderFactory;
exports.stringFormatFactory = stringFormatFactory;
exports.StringFormat = StringFormat;
exports.BuilderContext = BuilderContext;