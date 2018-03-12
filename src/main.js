/* jslint esnext: true */

import IntlMessageFormat from './core';
import defaultLocale from './en';
import {StringBuilderFactory, ArrayBuilderFactory, BuilderContext} from './messageBuilders';
import {StringFormatFactory, StringFormat} from './compilerUtil';

IntlMessageFormat.__addLocaleData(defaultLocale);
IntlMessageFormat.defaultLocale = 'en';

export default IntlMessageFormat;
export {
    StringBuilderFactory,
    ArrayBuilderFactory,
    StringFormatFactory,
    StringFormat,
    BuilderContext
};