/* jslint esnext: true */

import IntlMessageFormat from './core';
import defaultLocale from './en';
import {StringBuilderFactory, ArrayBuilderFactory} from './messageBuilders';

IntlMessageFormat.__addLocaleData(defaultLocale);
IntlMessageFormat.defaultLocale = 'en';

export default IntlMessageFormat;
export {StringBuilderFactory, ArrayBuilderFactory};