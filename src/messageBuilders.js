/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

import {isArray} from './es5';

// ===== Array Builder Factory =====
export function ArrayBuilderFactory() {
    return new ArrayBuilder();
}

export function ArrayBuilder() {
    this._elements = [];
}

ArrayBuilder.prototype.append = function (element) {
    if (!element || !element.length) {
        return;
    }

    if (isArray(element)) {
        Array.prototype.push.apply(this._elements, element);
    }
    else {
        this._elements.push(element);
    }
};

ArrayBuilder.prototype.appendText = function (elements) {
    return this.append(elements);
};

ArrayBuilder.prototype.appendSimpleMessage = function (elements) {
    return this.append(elements);
};

ArrayBuilder.prototype.appendFormattedMessage = function (elements) {
    return this.append(elements);
};

ArrayBuilder.prototype.appendTag = function (elements) {
    return this.append(elements);
};

ArrayBuilder.prototype.build = function () {
    return this._elements;
};

// ===== String Builder Factory =====
export function StringBuilderFactory() {
    return new StringBuilder();
}

export function StringBuilder() {
    this._str = '';
}

StringBuilder.prototype.append = function (text) {
    this._str += (text || '');
};

StringBuilder.prototype.appendText = function (text) {
    return this.append(text);
};

StringBuilder.prototype.appendSimpleMessage = function (text) {
    return this.append(text);
};

StringBuilder.prototype.appendFormattedMessage = function (text) {
    return this.append(text);
};

StringBuilder.prototype.appendTag = function (text) {
    return this.append(text);
};

StringBuilder.prototype.build = function () {
    return this._str;
};
