/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*jshint node:true */
/*global describe,it,beforeEach,afterEach,expect,IntlMessageFormat */
'use strict';
var ArrayBuilderFactory = IntlMessageFormat.ArrayBuilderFactory;

describe('IntlMessageFormat', function () {
    it('should be a function', function () {
        expect(IntlMessageFormat).to.be.a('function');
    });

    // STATIC

    describe('.__addLocaleData( [obj] )', function () {
        it('should respond to .__addLocaleData()', function () {
            expect(IntlMessageFormat.__addLocaleData).to.be.a('function');
        });
    });

    // INSTANCE METHODS

    var pluralMsg = '' +
        'I have {numPeople, plural,' +
        '=0 {zero points}' +
        'one {a point}' +
        '}.';

    it ('should throw when `other` is missing from plural message', function () {
        function createMf() {
            new IntlMessageFormat(pluralMsg, 'en');
        }

        expect(createMf).to.throwException(function (e) {
            expect(e).to.be.an(Error);
            expect(e.message).to.match(/pluralFormat requires an `other` option, this can be disabled./);
        });
    });

    it ('should throw when `other` is required but missing from plural message', function () {
        function createMf() {
            new IntlMessageFormat(pluralMsg, 'en', {}, { requireOther: true });
        }

        expect(createMf).to.throwException(function (e) {
            expect(e).to.be.an(Error);
            expect(e.message).to.match(/pluralFormat requires an `other` option, this can be disabled./);
        });
    });

    it ('should throw when tag and argument uses same id/name value', function () {
        function createMf() {
            new IntlMessageFormat("<x:link>{link}</x:link>");
        }

        expect(createMf).to.throwException(function (e) {
            expect(e).to.be.an(Error);
            expect(e.message).to.match(/Message has conflicting argument and tag name "link"/);
        });
    });

    it ('should throw when argument and tag uses same id/name value', function () {
        function createMf() {
            new IntlMessageFormat("{link}<x:link>click</x:link>");
        }

        expect(createMf).to.throwException(function (e) {
            expect(e).to.be.an(Error);
            expect(e.message).to.match(/Message has conflicting argument and tag name "link"/);
        });
    });

    describe('#resolvedOptions( )', function () {
        it('should be a function', function () {
            var mf = new IntlMessageFormat('');
            expect(mf.resolvedOptions).to.be.a('function');
        });

        it('should have a `locale` property', function () {
            var mf = new IntlMessageFormat('');
            expect(mf.resolvedOptions()).to.have.key('locale');
        });

        describe('`locale`', function () {
            var IMFLocaleData = IntlMessageFormat.__localeData__;
            var localeData    = {};

            // Helper to remove and replace the locale data available during the
            // the different tests.
            function transferLocaleData(from, to) {
                for (var locale in from) {
                    if (Object.prototype.hasOwnProperty.call(from, locale)) {
                        if (locale === IntlMessageFormat.defaultLocale) {
                            continue;
                        }

                        to[locale] = from[locale];
                        delete from[locale];
                    }
                }
            }

            beforeEach(function () {
                transferLocaleData(IMFLocaleData, localeData);
            });

            afterEach(function () {
                transferLocaleData(localeData, IMFLocaleData);
            });

            it('should default to "en"', function () {
                var mf = new IntlMessageFormat('');
                expect(mf.resolvedOptions().locale).to.equal('en');
            });

            it('should normalize the casing', function () {
                transferLocaleData(localeData, IMFLocaleData);

                var mf = new IntlMessageFormat('', 'en-us');
                expect(mf.resolvedOptions().locale).to.equal('en-US');

                mf = new IntlMessageFormat('', 'EN-US');
                expect(mf.resolvedOptions().locale).to.equal('en-US');
            });

            it('should be a fallback value when data is missing', function () {
                IMFLocaleData.fr = localeData.fr;

                var mf = new IntlMessageFormat('', 'fr-FR');
                expect(mf.resolvedOptions().locale).to.equal('fr');

                mf = new IntlMessageFormat('', 'pt');
                expect(mf.resolvedOptions().locale).to.equal('en');
            });
        });
    });

    describe('#format( [object] )', function () {
        it('should be a function', function () {
            var mf = new IntlMessageFormat('');
            expect(mf.format).to.be.a('function');
        });

        it('should return a string', function () {
            var mf = new IntlMessageFormat('');
            expect(mf.format()).to.be.a('string');
        });

        it ('should throw when nested argument is missing', function () {
            function createMf() {
                var mf = new IntlMessageFormat("{product.link}");
                mf.format({ product: {} });
            }

            expect(createMf).to.throwException(function (e) {
                expect(e).to.be.an(Error);
                expect(e.message).to.match(/The intl string context variable 'product.link' value was not provided to the string '{product.link}'/);
            });
        });

        it ('should throw when nested tag is missing', function () {
            function createMf() {
                var mf = new IntlMessageFormat("<x:product.link>click</x:product.link>");
                mf.format({ product: {} });
            }

            expect(createMf).to.throwException(function (e) {
                expect(e).to.be.an(Error);
                expect(e.message).to.match(/The intl string context variable 'product.link' function was not provided to the string '<x:product.link>click<\/x:product.link>'/);
            });
        });

        it ('should throw when `messageBuilderFactory` is not a function', function () {
            function createMf() {
                var mf = new IntlMessageFormat("<x:product.link>click</x:product.link>");
                mf.format({ product: {} }, { messageBuilderFactory: 'invalid' });
            }

            expect(createMf).to.throwException(function (e) {
                expect(e).to.be.an(Error);
                expect(e.message).to.match(/Message `format` option `messageBuilderFactory` requires a function./);
            });
        });

        it ('should return formatted message when `other` is missing but not required', function () {
            var mf = new IntlMessageFormat(pluralMsg, 'en', {}, { requireOther: false });
            expect(mf.format({ numPeople: 0 })).to.equal('I have zero points.');
        });

        it ('should return an empty `other` message part when `other` is not required and not defined', function () {
            var mf = new IntlMessageFormat(pluralMsg, 'en', {}, { requireOther: false });
            expect(mf.format({ numPeople: 10 })).to.equal('I have .');
        });

        it ('should format nested object values', function () {
            var mf = new IntlMessageFormat('My name is {user.name}', 'en');
            expect(mf.format({ user: { name: 'Bob' } })).to.equal('My name is Bob');
        });

        it ('should format with numbered value argument', function () {
            var mf = new IntlMessageFormat('My name is {0}', 'en');
            expect(mf.format({ 0: 'Bob' })).to.equal('My name is Bob');
        });
    });

    describe('using a string pattern', function () {
        it('should properly replace direct arguments in the string', function () {
            var mf = new IntlMessageFormat('My name is {FIRST} {LAST}.');
            var output = mf.format({
                FIRST: 'Anthony',
                LAST : 'Pipkin'
            });

            expect(output).to.equal('My name is Anthony Pipkin.');
        });

        it('should not ignore zero values', function() {
            var mf = new IntlMessageFormat('I am {age} years old.');
            var output = mf.format({
                age: 0
            });

            expect(output).to.equal('I am 0 years old.');
        });

        it('should ignore false, null, and undefined', function() {
            var mf = new IntlMessageFormat('{a}{b}{c}');
            var output = mf.format({
                a: false,
                b: null,
                c: undefined
            });

            expect(output).to.equal('');
        });

        it('should return array', function () {
            var mf = new IntlMessageFormat('My name is {FIRST} {LAST}.');
            var output = mf.format({
                FIRST: 'Anthony',
                LAST : 'Pipkin'
            }, { messageBuilderFactory: ArrayBuilderFactory });

            expect(output).to.eql(['My name is ', 'Anthony', ' ', 'Pipkin', '.']);
        });
    });

    describe('and plurals under the Arabic locale', function () {
        var msg = '' +
            'I have {numPeople, plural,' +
                'zero {zero points}' +
                'one {a point}' +
                'two {two points}' +
                'few {a few points}' +
                'many {lots of points}' +
                'other {some other amount of points}}' +
            '.';

        var msgFmt = new IntlMessageFormat(msg, 'ar');

        it('should match zero', function () {
            var m = msgFmt.format({
                numPeople: 0
            });

            expect(m).to.equal('I have zero points.');
        });

        it('should match one', function () {
            var m = msgFmt.format({
                numPeople: 1
            });

            expect(m).to.equal('I have a point.');
        });

        it('should match two', function () {
            var m = msgFmt.format({
                numPeople: 2
            });

            expect(m).to.equal('I have two points.');
        });

        it('should match few', function () {
            var m = msgFmt.format({
                numPeople: 5
            });

            expect(m).to.equal('I have a few points.');
        });

        it('should match many', function () {
            var m = msgFmt.format({
                numPeople: 20
            });

            expect(m).to.equal('I have lots of points.');
        });

        it('should match other', function () {
            var m = msgFmt.format({
                numPeople: 100
            });

            expect(m).to.equal('I have some other amount of points.');
        });
    });

    describe('and changing the locale', function () {
        var simple = {
            en: '{NAME} went to {CITY}.',

            fr: '{NAME} est {GENDER, select, ' +
                    'female {allée}' +
                    'other {allé}}'+
                ' à {CITY}.'
        };

        var complex = {
            en: '{TRAVELLERS} went to {CITY}.',

            fr: '{TRAVELLERS} {TRAVELLER_COUNT, plural, ' +
                    '=1 {est {GENDER, select, ' +
                        'female {allée}' +
                        'other {allé}}}' +
                    'other {sont {GENDER, select, ' +
                        'female {allées}' +
                        'other {allés}}}}' +
                ' à {CITY}.'
        };

        var maleObj = {
            NAME  : 'Tony',
            CITY  : 'Paris',
            GENDER: 'male'
        };

        var femaleObj = {
            NAME  : 'Jenny',
            CITY  : 'Paris',
            GENDER: 'female'
        };

        var maleTravelers = {
            TRAVELLERS     : 'Lucas, Tony and Drew',
            TRAVELLER_COUNT: 3,
            GENDER         : 'male',
            CITY           : 'Paris'
        };

        var femaleTravelers = {
            TRAVELLERS     : 'Monica',
            TRAVELLER_COUNT: 1,
            GENDER         : 'female',
            CITY           : 'Paris'
        };

        it('should format message en-US simple with different objects', function () {
            var msgFmt = new IntlMessageFormat(simple.en, 'en-US');
            expect(msgFmt.format(maleObj)).to.equal('Tony went to Paris.');
            expect(msgFmt.format(femaleObj)).to.equal('Jenny went to Paris.');
        });


        it('should format message fr-FR simple with different objects', function () {
            var msgFmt = new IntlMessageFormat(simple.fr, 'fr-FR');
            expect(msgFmt.format(maleObj)).to.equal('Tony est allé à Paris.');
            expect(msgFmt.format(femaleObj)).to.equal('Jenny est allée à Paris.');
        });

        it('should format message en-US complex with different objects', function () {
            var msgFmt = new IntlMessageFormat(complex.en, 'en-US');
            expect(msgFmt.format(maleTravelers)).to.equal('Lucas, Tony and Drew went to Paris.');
            expect(msgFmt.format(femaleTravelers)).to.equal('Monica went to Paris.');
        });


        it('should format message fr-FR complex with different objects', function () {
            var msgFmt = new IntlMessageFormat(complex.fr, 'fr-FR');
            expect(msgFmt.format(maleTravelers)).to.equal('Lucas, Tony and Drew sont allés à Paris.');
            expect(msgFmt.format(femaleTravelers)).to.equal('Monica est allée à Paris.');
        });
    });

    describe('and change the locale with different counts', function () {
        var messages = {
            en: '{COMPANY_COUNT, plural, ' +
                    '=1 {One company}' +
                    'other {# companies}}' +
                ' published new books.',

            ru: '{COMPANY_COUNT, plural, ' +
                    '=1 {Одна компания опубликовала}' +
                    'one {# компания опубликовала}' +
                    'few {# компании опубликовали}' +
                    'many {# компаний опубликовали}' +
                    'other {# компаний опубликовали}}' +
                ' новые книги.'
        };

        it('should format a message with en-US locale', function () {
            var msgFmt = new IntlMessageFormat(messages.en, 'en-US');

            expect(msgFmt.format({COMPANY_COUNT: 0})).to.equal('0 companies published new books.');
            expect(msgFmt.format({COMPANY_COUNT: 1})).to.equal('One company published new books.');
            expect(msgFmt.format({COMPANY_COUNT: 2})).to.equal('2 companies published new books.');
            expect(msgFmt.format({COMPANY_COUNT: 5})).to.equal('5 companies published new books.');
            expect(msgFmt.format({COMPANY_COUNT: 10})).to.equal('10 companies published new books.');
        });

        it('should format a message with ru-RU locale', function () {
            var msgFmt = new IntlMessageFormat(messages.ru, 'ru-RU');

            expect(msgFmt.format({COMPANY_COUNT: 0})).to.equal('0 компаний опубликовали новые книги.');
            expect(msgFmt.format({COMPANY_COUNT: 1})).to.equal('Одна компания опубликовала новые книги.');
            expect(msgFmt.format({COMPANY_COUNT: 2})).to.equal('2 компании опубликовали новые книги.');
            expect(msgFmt.format({COMPANY_COUNT: 5})).to.equal('5 компаний опубликовали новые книги.');
            expect(msgFmt.format({COMPANY_COUNT: 10})).to.equal('10 компаний опубликовали новые книги.');
            expect(msgFmt.format({COMPANY_COUNT: 21})).to.equal('21 компания опубликовала новые книги.');
        });
    });

    describe('arguments with', function () {

        describe('no spaces', function() {
            var msg   = new IntlMessageFormat('{STATE}'),
                state = 'Missouri';

            it('should fail when the argument in the pattern is not provided', function () {
                expect(msg.format).to.throwException(function (e) {
                    expect(e).to.be.an(Error);
                    expect(e.message).to.match(/The intl string context variable 'STATE' value was not provided to the string '{STATE}'/);
                });
            });

            it('should fail when the argument in the pattern has a typo', function () {
                function formatWithValueNameTypo() {
                    return msg.format({'ST ATE': state});
                }

                expect(formatWithValueNameTypo).to.throwException(function (e) {
                    expect(e).to.be.an(Error);
                    expect(e.message).to.match(/The intl string context variable 'STATE' value was not provided to the string '{STATE}'/);
                });
            });

            it('should succeed when the argument is correct', function () {
                expect(msg.format({ STATE: state })).to.equal(state);
            });
        });

        describe('a numeral', function() {
            var msg   = new IntlMessageFormat('{ST1ATE}'),
                state = 'Missouri';

            it('should fail when the argument in the pattern is not provided', function () {
                function formatWithMissingValue() {
                    return msg.format({ FOO: state });
                }

                expect(formatWithMissingValue).to.throwException(function (e) {
                    expect(e).to.be.an(Error);
                    expect(e.message).to.match(/The intl string context variable 'ST1ATE' value was not provided to the string '{ST1ATE}'/);
                });
            });

            it('should fail when the argument in the pattern has a typo', function () {
                function formatWithMissingValue() {
                    msg.format({ 'ST ATE': state });
                }

                expect(formatWithMissingValue).to.throwException(function (e) {
                    expect(e).to.be.an(Error);
                    expect(e.message).to.match(/The intl string context variable 'ST1ATE' value was not provided to the string '{ST1ATE}'/);
                });
            });

            it('should succeed when the argument is correct', function () {
                expect(msg.format({ ST1ATE: state })).to.equal(state);
            });
        });
    });

    describe('selectordinal arguments', function () {
        var msg = 'This is my {year, selectordinal, one{#st} two{#nd} few{#rd} other{#th}} birthday.';

        it('should parse without errors', function () {
            expect(IntlMessageFormat.__parse).withArgs(msg).to.not.throwException();
        });

        describe('StringBuilder', function() {
            it('should use ordinal pluralization rules', function () {
                var mf = new IntlMessageFormat(msg, 'en');

                expect(mf.format({year: 1})).to.equal('This is my 1st birthday.');
                expect(mf.format({year: 2})).to.equal('This is my 2nd birthday.');
                expect(mf.format({year: 3})).to.equal('This is my 3rd birthday.');
                expect(mf.format({year: 4})).to.equal('This is my 4th birthday.');
                expect(mf.format({year: 11})).to.equal('This is my 11th birthday.');
                expect(mf.format({year: 21})).to.equal('This is my 21st birthday.');
                expect(mf.format({year: 22})).to.equal('This is my 22nd birthday.');
                expect(mf.format({year: 33})).to.equal('This is my 33rd birthday.');
                expect(mf.format({year: 44})).to.equal('This is my 44th birthday.');
                expect(mf.format({year: 1024})).to.equal('This is my 1,024th birthday.');
            });
        });

        describe('ArrayBuilder', function() {
            it('should use ordinal pluralization rules', function () {
                var mf = new IntlMessageFormat(msg, 'en');

                expect(mf.format({year: 1}, { messageBuilderFactory: ArrayBuilderFactory })).to.eql(['This is my ', '1st', ' birthday.']);
                expect(mf.format({year: 2}, { messageBuilderFactory: ArrayBuilderFactory })).to.eql(['This is my ', '2nd', ' birthday.']);
                expect(mf.format({year: 3}, { messageBuilderFactory: ArrayBuilderFactory })).to.eql(['This is my ', '3rd', ' birthday.']);
                expect(mf.format({year: 4}, { messageBuilderFactory: ArrayBuilderFactory })).to.eql(['This is my ', '4th', ' birthday.']);
                expect(mf.format({year: 11}, { messageBuilderFactory: ArrayBuilderFactory })).to.eql(['This is my ', '11th', ' birthday.']);
                expect(mf.format({year: 21}, { messageBuilderFactory: ArrayBuilderFactory })).to.eql(['This is my ', '21st', ' birthday.']);
                expect(mf.format({year: 22}, { messageBuilderFactory: ArrayBuilderFactory })).to.eql(['This is my ', '22nd', ' birthday.']);
                expect(mf.format({year: 33}, { messageBuilderFactory: ArrayBuilderFactory })).to.eql(['This is my ', '33rd', ' birthday.']);
                expect(mf.format({year: 44}, { messageBuilderFactory: ArrayBuilderFactory })).to.eql(['This is my ', '44th', ' birthday.']);
                expect(mf.format({year: 1024}, { messageBuilderFactory: ArrayBuilderFactory })).to.eql(['This is my ', '1,024th', ' birthday.']);
            });
        });
    });

    describe('tags', function() {
        describe('StringBuilder', function() {
            it('should not prevent use of HTML tags', function () {
                var mf = new IntlMessageFormat("<span>hello</span>");
                expect(mf.format()).to.equal("<span>hello</span>");
            });

            it('should replace a single tag placeholder using the variable function', function () {
                var mf = new IntlMessageFormat("<x:link>click me</x:link>");

                var calls = [];
                var linkFunc = function (content) {
                    calls.push(arguments);
                    return "<a href='#'>" + content + "</a>";
                };

                var result = mf.format({link: linkFunc});

                expect(calls).to.have.length(1);
                expect(calls[0]).to.have.length(1);
                expect(calls[0][0]).to.eql("click me");
                expect(result).to.equal("<a href='#'>click me</a>");
            });

            it('should replace a single tag placeholder with nested tag name', function () {
                var mf = new IntlMessageFormat("<x:product.link>buy now</x:product.link>");

                var calls = [];
                var linkFunc = function (content) {
                    calls.push(arguments);
                    return "<a href='#'>" + content + "</a>";
                };

                var result = mf.format({product: {link: linkFunc}});

                expect(calls).to.have.length(1);
                expect(calls[0]).to.have.length(1);
                expect(calls[0][0]).to.eql("buy now");
                expect(result).to.equal("<a href='#'>buy now</a>");
            });

            it('should replace nested tag placeholders using the variable function', function () {
                var mf = new IntlMessageFormat("<x:link>get a <x:bold>discount</x:bold> now</x:link>");

                var calls = [];
                var linkFunc = function (content) {
                    calls.push(arguments);
                    return "<a href='#'>" + content + "</a>";
                };

                var boldFunc = function (content) {
                    calls.push(arguments);
                    return "<b>" + content + "</b>";
                };

                var result = mf.format({
                    link: linkFunc,
                    bold: boldFunc
                });

                expect(calls).to.have.length(2);
                expect(calls[0]).to.have.length(1);
                expect(calls[0][0]).to.eql("discount");
                expect(calls[1]).to.have.length(1);
                expect(calls[1][0]).to.eql("get a <b>discount</b> now");
                expect(result).to.equal("<a href='#'>get a <b>discount</b> now</a>");
            });

            it('should replace repeated tag placeholders using the variable function', function () {
                var mf = new IntlMessageFormat("<x:important>privacy</x:important> and <x:important>security</x:important>");

                var calls = [];
                var importantFunc = function (content) {
                    calls.push(arguments);
                    return "<u>" + content + "</u>";
                };

                var result = mf.format({important: importantFunc});

                expect(calls).to.have.length(2);
                expect(calls[0]).to.have.length(1);
                expect(calls[0][0]).to.eql("privacy");
                expect(calls[1]).to.have.length(1);
                expect(calls[1][0]).to.eql("security");
                expect(result).to.equal("<u>privacy</u> and <u>security</u>");
            });

            it('should replace the self-closing tag using the variable function', function () {
                var mf = new IntlMessageFormat("<x:emoji />");

                var calls = [];
                var tagFunc = function () {
                    calls.push(arguments);
                    return ":)";
                };

                var result = mf.format({emoji: tagFunc});

                expect(calls).to.have.length(1);
                expect(calls[0][0]).to.be(undefined);
                expect(result).to.equal(":)");
            });
        });

        describe('ArrayBuilder', function() {
            it('should not prevent use of HTML tags', function () {
                var mf = new IntlMessageFormat("<span>hello</span>");
                expect(mf.format({}, { messageBuilderFactory: ArrayBuilderFactory })).to.eql(['<span>hello</span>']);
            });

            it('should replace a single tag placeholder using the variable function', function () {
                var mf = new IntlMessageFormat("<x:link>click me</x:link>");

                var calls = [];
                var linkFunc = function (children) {
                    calls.push(arguments);
                    return ["<a href='#'>", children, "</a>"];
                };

                var result = mf.format({link: linkFunc}, { messageBuilderFactory: ArrayBuilderFactory });

                expect(calls).to.have.length(1);
                expect(calls[0]).to.have.length(1);
                expect(calls[0][0]).to.eql(["click me"]);
                expect(result).to.eql(["<a href='#'>", ["click me"], "</a>"]);
            });

            it('should replace a single tag placeholder with nested tag name', function () {
                var mf = new IntlMessageFormat("<x:product.link>buy now</x:product.link>");

                var calls = [];
                var linkFunc = function (children) {
                    calls.push(arguments);
                    return ["<a href='#'>", children, "</a>"];
                };

                var result = mf.format({product: {link: linkFunc}}, { messageBuilderFactory: ArrayBuilderFactory });

                expect(calls).to.have.length(1);
                expect(calls[0]).to.have.length(1);
                expect(calls[0][0]).to.eql(["buy now"]);
                expect(result).to.eql(["<a href='#'>", ["buy now"], "</a>"]);
            });

            it('should replace nested tag placeholders using the variable function', function () {
                var mf = new IntlMessageFormat("<x:link>get a <x:bold>discount</x:bold> now</x:link>");

                var calls = [];
                var linkFunc = function (content) {
                    calls.push(arguments);
                    return ["<a href='#'>", content , "</a>"];
                };

                var boldFunc = function (content) {
                    calls.push(arguments);
                    return ["<b>", content, "</b>"];
                };

                var result = mf.format({
                    link: linkFunc,
                    bold: boldFunc
                }, { messageBuilderFactory: ArrayBuilderFactory });

                expect(calls).to.have.length(2);
                expect(calls[0]).to.have.length(1);
                expect(calls[0][0]).to.eql(["discount"]);
                expect(calls[1]).to.have.length(1);
                expect(calls[1][0]).to.eql(["get a ", "<b>", ["discount"], "</b>", " now"]);
                expect(result).to.eql(["<a href='#'>", [ "get a ", "<b>", ["discount"], "</b>", " now" ], "</a>"]);
            });

            it('should replace repeated tag placeholders using the variable function', function () {
                var mf = new IntlMessageFormat("<x:important>privacy</x:important> and <x:important>security</x:important>");

                var calls = [];
                var importantFunc = function (content) {
                    calls.push(arguments);
                    return ["<u>", content, "</u>"];
                };

                var result = mf.format({important: importantFunc}, { messageBuilderFactory: ArrayBuilderFactory });

                expect(calls).to.have.length(2);
                expect(calls[0]).to.have.length(1);
                expect(calls[0][0]).to.eql(["privacy"]);
                expect(calls[1]).to.have.length(1);
                expect(calls[1][0]).to.eql(["security"]);
                expect(result).to.eql(["<u>", [ "privacy" ], "</u>", " and ", "<u>", [ "security" ], "</u>"]);
            });

            it('should replace the self-closing tag using the variable function', function () {
                var mf = new IntlMessageFormat("<x:emoji />");

                var calls = [];
                var tagFunc = function () {
                    calls.push(arguments);
                    return ":)";
                };

                var result = mf.format({emoji: tagFunc}, { messageBuilderFactory: ArrayBuilderFactory });

                expect(calls).to.have.length(1);
                expect(calls[0][0]).to.be(undefined);
                expect(result).to.eql([":)"]);
            });
        });

        describe('messageBuilderContext', function() {

            function TestContext() { this._calls = []; }
            TestContext.prototype.message = function(msg) {
                this._message = msg;
            };
            TestContext.prototype.formatted = function(msg) {
                this._formatted = msg;
                return msg;
            };
            TestContext.prototype.appendCall = function(args) {
                this._calls.push(args);
            };

            function TestBuilder(builderCtx) {
                this._ctx = builderCtx;
                this._str = '';
            }

            TestBuilder.prototype.append = function (text) {
                this._str += (text || '');
            };

            TestBuilder.prototype.appendText = function (text) {
                this._ctx.appendCall(['appendText', text]);
                return this.append(text);
            };

            TestBuilder.prototype.appendSimpleMessage = function (text, argName) {
                this._ctx.appendCall(['appendSimpleMessage', text, argName]);
                return this.append(text);
            };

            TestBuilder.prototype.appendFormattedMessage = function (text, argName) {
                this._ctx.appendCall(['appendFormattedMessage', text, argName]);
                return this.append(text);
            };

            TestBuilder.prototype.appendTag = function (text, tagName) {
                this._ctx.appendCall(['appendTag', text, tagName]);
                return this.append(text);
            };

            TestBuilder.prototype.build = function () {
                this._ctx.appendCall(['build']);
                return this._str;
            };

            it('should be assigned the message values', function () {
                var mf = new IntlMessageFormat("hello world");
                var ctx = new TestContext();
                var result = mf.format({}, {
                    messageBuilderContext: ctx
                });

                expect(ctx._message).to.equal('hello world');
                expect(ctx._formatted).to.equal('hello world');
                expect(ctx._formatted).to.equal(result);
            });

            it('should receive text calls from message builder', function () {
                var mf = new IntlMessageFormat("hello world");
                var ctx = new TestContext();
                var result = mf.format({}, {
                    messageBuilderContext: ctx,
                    messageBuilderFactory: function (ctx) { return new TestBuilder(ctx); }
                });

                expect(result).to.equal('hello world');
                expect(ctx._calls.length).to.equal(2);
                expect(ctx._calls[0][0]).to.equal('appendText');
                expect(ctx._calls[0][1]).to.equal('hello world');

                expect(ctx._calls[1][0]).to.equal('build');
            });

            it('should receive simpleMessage calls from message builder', function () {
                var mf = new IntlMessageFormat("hello {name}");
                var ctx = new TestContext();
                var result = mf.format({ name: 'world' }, {
                    messageBuilderContext: ctx,
                    messageBuilderFactory: function (ctx) { return new TestBuilder(ctx); }
                });

                expect(result).to.equal('hello world');
                expect(ctx._calls.length).to.equal(3);
                expect(ctx._calls[0][0]).to.equal('appendText');
                expect(ctx._calls[0][1]).to.equal('hello ');

                expect(ctx._calls[1][0]).to.equal('appendSimpleMessage');
                expect(ctx._calls[1][1]).to.equal('world');
                expect(ctx._calls[1][2]).to.equal('name');

                expect(ctx._calls[2][0]).to.equal('build');
            });

            it('should receive formattedMessage calls from message builder', function () {
                var mf = new IntlMessageFormat("{question, select, yes {true} other {false}}");
                var ctx = new TestContext();
                var result = mf.format({ question: 'yes' }, {
                    messageBuilderContext: ctx,
                    messageBuilderFactory: function (ctx) { return new TestBuilder(ctx); }
                });

                expect(result).to.equal('true');
                expect(ctx._calls.length).to.equal(4);

                expect(ctx._calls[0][0]).to.equal('appendText');
                expect(ctx._calls[0][1]).to.equal('true');

                expect(ctx._calls[1][0]).to.equal('build');

                expect(ctx._calls[2][0]).to.equal('appendFormattedMessage');
                expect(ctx._calls[2][1]).to.equal('true');
                expect(ctx._calls[2][2]).to.equal('question');

                expect(ctx._calls[3][0]).to.equal('build');
            });

            it('should receive appendTag calls from message builder', function () {
                var mf = new IntlMessageFormat("<x:link>click</x:link>");
                var ctx = new TestContext();
                var result = mf.format({ link: function (children) { return '<a>' + children + '</a>'; } }, {
                    messageBuilderContext: ctx,
                    messageBuilderFactory: function (ctx) { return new TestBuilder(ctx); }
                });

                expect(result).to.equal('<a>click</a>');
                expect(ctx._calls.length).to.equal(4);

                expect(ctx._calls[0][0]).to.equal('appendText');
                expect(ctx._calls[0][1]).to.equal('click');

                expect(ctx._calls[1][0]).to.equal('build');

                expect(ctx._calls[2][0]).to.equal('appendTag');
                expect(ctx._calls[2][1]).to.equal('<a>click</a>');
                expect(ctx._calls[2][2]).to.equal('link');

                expect(ctx._calls[3][0]).to.equal('build');
            });
        });

    });

    describe('exceptions', function () {
        it('should use the correct PT plural rules', function () {
            var msg  = '{num, plural, one{one} other{other}}';
            var pt   = new IntlMessageFormat(msg, 'pt');
            var ptMZ = new IntlMessageFormat(msg, 'pt-MZ');

            expect(pt.format({num: 0})).to.equal('one');
            expect(ptMZ.format({num: 0})).to.equal('other');
        });
    });
});
