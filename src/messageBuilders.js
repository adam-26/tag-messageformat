/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

import {isArray} from './es5';

export function BuilderContext() {}

BuilderContext.prototype.message = function (/*message*/) {
    // no-op
    // other context implementations may utilize the message for other purposes.
};

BuilderContext.prototype.formatted = function (formattedMessage) {
    return formattedMessage;
};

// ===== Array Builder Factory =====
export function arrayBuilderFactory(/* builderCtx */) {
    return new ArrayBuilder(/* builderCtx */);
}

export function ArrayBuilder(/* builderCtx */) {
    this._elements = [];
}

ArrayBuilder.prototype.append = function (element) {
    if (typeof element === 'undefined' || element === null) {
        return;
    }

    if (isArray(element)) {
        if (Array.prototype.push.apply) {
            Array.prototype.push.apply(this._elements, element);
        } else {
            // IE 8
            for (var i = 0, len = element.length; i < len; i++) {
                this._elements.push(element);
            }
        }

    }
    else {
        this._elements.push(element);
    }
};

ArrayBuilder.prototype.appendText = function (elements) {
    return this.append(elements);
};

ArrayBuilder.prototype.appendSimpleMessage = function (elements/*, argName*/) {
    return this.append(elements);
};

ArrayBuilder.prototype.appendFormattedMessage = function (elements/*, argName*/) {
    return this.append(elements);
};

ArrayBuilder.prototype.appendTag = function (elements/*, tagName*/) {
    return this.append(elements);
};

ArrayBuilder.prototype.build = function () {
    return this._elements;
};

// ===== String Builder Factory =====
export function stringBuilderFactory(/* builderCtx */) {
    return new StringBuilder(/* builderCtx */);
}

export function StringBuilder(/* builderCtx */) {
    this._str = '';
}

StringBuilder.prototype.append = function (text) {
    this._str += (text || '');
};

StringBuilder.prototype.appendText = function (text) {
    return this.append(text);
};

StringBuilder.prototype.appendSimpleMessage = function (text/*, argName*/) {
    return this.append(text);
};

StringBuilder.prototype.appendFormattedMessage = function (text/*, argName*/) {
    return this.append(text);
};

StringBuilder.prototype.appendTag = function (text/*, tagName*/) {
    return this.append(text);
};

StringBuilder.prototype.build = function () {
    return this._str;
};
