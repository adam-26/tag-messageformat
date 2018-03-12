// This file is used for the build process to generate 'dist/intl-messageformat*' files

import {defineProperty} from './src/es5';
import IntlMessageFormat, {
    StringBuilderFactory,
    ArrayBuilderFactory,
    StringFormatFactory,
    StringFormat,
    BuilderContext
} from './src/main';

// Define static methods for bundling
defineProperty(IntlMessageFormat, 'StringBuilderFactory', {value: StringBuilderFactory});
defineProperty(IntlMessageFormat, 'ArrayBuilderFactory', {value: ArrayBuilderFactory});
defineProperty(IntlMessageFormat, 'StringFormatFactory', {value: StringFormatFactory});
defineProperty(IntlMessageFormat, 'StringFormat', {value: StringFormat});
defineProperty(IntlMessageFormat, 'BuilderContext', {value: BuilderContext});

export default IntlMessageFormat;