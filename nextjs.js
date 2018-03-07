// This file is used for the build process to generate 'dist/intl-messageformat*' files

import {defineProperty} from './src/es5';
import IntlMessageFormat, {StringBuilderFactory, ArrayBuilderFactory} from './src/main';

// Define static methods for bundling
defineProperty(IntlMessageFormat, 'StringBuilderFactory', {value: StringBuilderFactory});
defineProperty(IntlMessageFormat, 'ArrayBuilderFactory', {value: ArrayBuilderFactory});

export default IntlMessageFormat;