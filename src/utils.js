/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

export var hop = Object.prototype.hasOwnProperty;

export function extend(obj) {
    var sources = Array.prototype.slice.call(arguments, 1),
        i, len, source, key;

    for (i = 0, len = sources.length; i < len; i += 1) {
        source = sources[i];
        if (!source) { continue; }

        for (key in source) {
            if (hop.call(source, key)) {
                obj[key] = source[key];
            }
        }
    }

    return obj;
}

export function assertValueProvided(isTag, value, key, id) {
    if (!(value && hop.call(value, key))) {
        var err = new Error('A value must be provided for: ' + (id || key));
        err.variableId = (id || key);
        err.variableType = isTag ? 'function' : 'value';
        throw err;
    }
}
