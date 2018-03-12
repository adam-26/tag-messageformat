// This file is used for the build process to generate 'dist/intl-messageformat*' files

import {defineProperty} from './src/es5';
import IntlMessageFormat, {
    stringBuilderFactory,
    arrayBuilderFactory,
    stringFormatFactory,
    StringFormat,
    BuilderContext
} from './src/main';

// Define static methods for bundling
defineProperty(IntlMessageFormat, 'stringBuilderFactory', {value: stringBuilderFactory});
defineProperty(IntlMessageFormat, 'arrayBuilderFactory', {value: arrayBuilderFactory});
defineProperty(IntlMessageFormat, 'stringFormatFactory', {value: stringFormatFactory});
defineProperty(IntlMessageFormat, 'StringFormat', {value: StringFormat});
defineProperty(IntlMessageFormat, 'BuilderContext', {value: BuilderContext});

export default IntlMessageFormat;