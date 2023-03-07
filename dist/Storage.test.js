"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const Storage_1 = __importDefault(require("./Storage"));
const Conversion = [
    ['"test"', 'test', 'test'],
    ['123', 123, '123'],
    ['123.059', 123.059, '123.059'],
    ['true', true, 'true'],
    ['false', false, 'false'],
    ['null', null, 'null'],
    ['undefined', undefined, 'undefined'],
    ['an object', {}, '[object Object]'],
    ['an empty array', [], ''],
    ['an array', [1, 2, 3], '1,2,3'],
    ['a function', () => { }, /^\s*\(\)\s*=>\s*\{\s*\}\s*$/u], // eslint-disable-line no-empty-function, @typescript-eslint/no-empty-function
];
(0, globals_1.describe)('new Storage()', () => {
    (0, globals_1.test)('Empty store on initialisation', () => {
        const k = new Storage_1.default();
        (0, globals_1.expect)(k.length).toBe(0);
    });
});
(0, globals_1.describe)('.toString()', () => {
    (0, globals_1.test)('toString() returns "[object Storage]"', () => {
        const k = new Storage_1.default();
        (0, globals_1.expect)(k.toString()).toBe('[object Storage]');
    });
});
(0, globals_1.describe)('.clear()', () => {
    (0, globals_1.test)('clear() removes any items in storage', () => {
        const k = new Storage_1.default();
        (0, globals_1.expect)(k.length).toBe(0);
        k.setItem('test', 123);
        (0, globals_1.expect)(k.length).toBe(1);
        k.clear();
        (0, globals_1.expect)(k.length).toBe(0);
    });
});
(0, globals_1.describe)('.getItem()', () => {
    (0, globals_1.test)('Returns "null" for non-existent key', () => {
        const k = new Storage_1.default();
        (0, globals_1.expect)(k.getItem('test')).toBe(null);
    });
    globals_1.test.each(Conversion)('Converts %s to a string before retrieving', (_message, key) => {
        const k = new Storage_1.default();
        k.setItem(key, 'test');
        (0, globals_1.expect)(k.getItem(key)).toBe('test');
    });
});
(0, globals_1.describe)('.setItem()', () => {
    globals_1.test.each(Conversion)('Converts %s to a string before setting', (_message, input, expected) => {
        const k = new Storage_1.default();
        k.setItem('test', input);
        if (expected instanceof RegExp) {
            (0, globals_1.expect)(k.getItem('test')).toMatch(expected);
        }
        else {
            (0, globals_1.expect)(k.getItem('test')).toBe(expected);
        }
    });
});
(0, globals_1.describe)('.length', () => {
    (0, globals_1.test)('Returns a length of zero for empty storage', () => {
        const k = new Storage_1.default();
        (0, globals_1.expect)(k.length).toBe(0);
    });
    (0, globals_1.test)('Returns a length of 1 when an item is set', () => {
        const k = new Storage_1.default();
        k.setItem('test', 123);
        (0, globals_1.expect)(k.length).toBe(1);
    });
});
(0, globals_1.describe)('.removeItem()', () => {
    (0, globals_1.test)('Returns the previous lngth when an item is set then removed', () => {
        const k = new Storage_1.default();
        k.setItem('a', 123);
        const length = k.length;
        k.setItem('b', 123);
        k.removeItem('b');
        (0, globals_1.expect)(k.length).toBe(length);
    });
    (0, globals_1.test)('Returns a length of zero removing an non-existent item', () => {
        const k = new Storage_1.default();
        k.removeItem('test');
        (0, globals_1.expect)(k.length).toBe(0);
    });
});
