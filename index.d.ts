declare class IntlMessageFormat {
    constructor(message: string, locales: string | string[], formats?: any);
    format(context?: any, formatOptions?: {
        messageBuilderFactory?: () => Object,
        messageBuilderContext?: () => Object
    }): string;
    static defaultLocale: string;
}

export default IntlMessageFormat;
