/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

export function StringFormatFactory(id) {
    return new StringFormat(id);
}

export function StringFormat(id) {
    this.id = id;
}

StringFormat.prototype.format = function (value) {
    if (!value && typeof value !== 'number') {
        return '';
    }

    return this.formatValue(value);
};

StringFormat.prototype.formatValue = function (value) {
    return typeof value === 'string' ? value : String(value);
};
