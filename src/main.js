/* jslint esnext: true */

import TagMessageFormat from './core';
import defaultLocale from './en';
import {stringBuilderFactory, arrayBuilderFactory, BuilderContext} from './messageBuilders';
import {stringFormatFactory, StringFormat} from './compilerUtil';

TagMessageFormat.__addLocaleData(defaultLocale);
TagMessageFormat.defaultLocale = 'en';

export default TagMessageFormat;
export {
    stringBuilderFactory,
    arrayBuilderFactory,
    stringFormatFactory,
    StringFormat,
    BuilderContext
};