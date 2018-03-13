'use strict';

global.Intl || require('intl');

var tagMessageFormat = require('../../');

var msg = 'Hello, world!';

module.exports = function () {
    new tagMessageFormat(msg, 'en-US');
};
