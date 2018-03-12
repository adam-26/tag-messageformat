/* jslint esnext: true */

import IntlMessageFormat from './core';
import defaultLocale from './en';
import {stringBuilderFactory, arrayBuilderFactory, BuilderContext} from './messageBuilders';
import {stringFormatFactory, StringFormat} from './compilerUtil';

IntlMessageFormat.__addLocaleData(defaultLocale);
IntlMessageFormat.defaultLocale = 'en';

export default IntlMessageFormat;
export {
    stringBuilderFactory,
    arrayBuilderFactory,
    stringFormatFactory,
    StringFormat,
    BuilderContext
};