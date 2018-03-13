'use strict';

global.Intl || require('intl');

var tagMessageFormat = require('../../');

var msg = 'Hello, world!';

var mf = new tagMessageFormat(msg, 'en-US');

module.exports = function () {
    mf.format();
};
