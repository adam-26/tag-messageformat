// This file is used for the build process to generate 'dist/intl-messageformat*' files

import {defineProperty} from './src/es5';
import TagMessageFormat, {
    stringBuilderFactory,
    arrayBuilderFactory,
    stringFormatFactory,
    StringFormat,
    BuilderContext
} from './src/main';

// Define static methods for bundling
defineProperty(TagMessageFormat, 'stringBuilderFactory', {value: stringBuilderFactory});
defineProperty(TagMessageFormat, 'arrayBuilderFactory', {value: arrayBuilderFactory});
defineProperty(TagMessageFormat, 'stringFormatFactory', {value: stringFormatFactory});
defineProperty(TagMessageFormat, 'StringFormat', {value: StringFormat});
defineProperty(TagMessageFormat, 'BuilderContext', {value: BuilderContext});

export default TagMessageFormat;