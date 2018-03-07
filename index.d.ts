declare class IntlMessageFormat {
    constructor(message: string, locales: string | string[], formats?: any);
    format(context?: any, messageBuilderFactory?: () => Object): string;
    static defaultLocale: string;
}

export default IntlMessageFormat;
