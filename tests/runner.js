if (typeof Intl === 'undefined') {
    require('intl');
}

global.expect = require('expect.js');
global.TagMessageFormat = require('../');
global.arrayBuilderFactory = require('../').arrayBuilderFactory;

require('./index');
