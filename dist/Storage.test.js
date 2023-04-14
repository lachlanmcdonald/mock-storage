"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2023 Lachlan McDonald. All rights reserved.
 * This file is licensed under the MIT License
 * https://github.com/lachlanmcdonald/mock-storage
 */
const globals_1 = require("@jest/globals");
const Storage_1 = require("./Storage");
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
const CREATES_STORAGE = Symbol();
const NEW_STORAGE = Symbol();
globals_1.describe.each([
    ['createStorage()', CREATES_STORAGE],
    ['new Storage()', NEW_STORAGE],
])('%s', (_message, type) => {
    let storageObject;
    (0, globals_1.beforeEach)(() => {
        if (type === CREATES_STORAGE) {
            storageObject = (0, Storage_1.createStorage)();
        }
        else if (type === NEW_STORAGE) {
            storageObject = new Storage_1.Storage();
        }
    });
    (0, globals_1.test)('Empty store on initialisation', () => {
        (0, globals_1.expect)(storageObject.length).toBe(0);
    });
    (0, globals_1.test)('.toString() returns "[object Storage]"', () => {
        (0, globals_1.expect)(storageObject.toString()).toBe('[object Storage]');
    });
    (0, globals_1.describe)('.clear()', () => {
        (0, globals_1.test)('clear() removes all items from storage', () => {
            (0, globals_1.expect)(storageObject.length).toBe(0);
            storageObject.setItem('test', 123);
            (0, globals_1.expect)(storageObject.length).toBe(1);
            storageObject.clear();
            (0, globals_1.expect)(storageObject.length).toBe(0);
        });
    });
    (0, globals_1.describe)('.getItem()', () => {
        (0, globals_1.test)('Returns "null" for non-existent key', () => {
            (0, globals_1.expect)(storageObject.getItem('test')).toBe(null);
        });
        globals_1.test.each(Conversion)('Converts %s to a string before retrieving', (_message, key) => {
            storageObject.setItem(key, 'test');
            (0, globals_1.expect)(storageObject.getItem(key)).toBe('test');
        });
    });
    (0, globals_1.describe)('.setItem()', () => {
        globals_1.test.each(Conversion)('Converts %s to a string before setting', (_message, input, expected) => {
            storageObject.setItem('test', input);
            if (expected instanceof RegExp) {
                (0, globals_1.expect)(storageObject.getItem('test')).toMatch(expected);
            }
            else {
                (0, globals_1.expect)(storageObject.getItem('test')).toBe(expected);
            }
        });
    });
    (0, globals_1.describe)('.length', () => {
        (0, globals_1.test)('Returns a length of zero for empty storage', () => {
            (0, globals_1.expect)(storageObject.length).toBe(0);
        });
        (0, globals_1.test)('Returns a length of 1 when an item is set', () => {
            storageObject.setItem('test', 123);
            (0, globals_1.expect)(storageObject.length).toBe(1);
        });
        (0, globals_1.test)('Returns correct length when a key of "length" is set with setItem', () => {
            (0, globals_1.expect)(storageObject.length).toBe(0);
            storageObject.setItem('length', 100);
            (0, globals_1.expect)(storageObject.length).toBe(1);
        });
    });
    (0, globals_1.describe)('.removeItem()', () => {
        (0, globals_1.test)('Returns the previous lngth when an item is set then removed', () => {
            storageObject.setItem('a', 123);
            const length = storageObject.length;
            storageObject.setItem('b', 123);
            storageObject.removeItem('b');
            (0, globals_1.expect)(storageObject.length).toBe(length);
        });
        (0, globals_1.test)('Returns a length of zero removing an non-existent item', () => {
            storageObject.removeItem('test');
            (0, globals_1.expect)(storageObject.length).toBe(0);
        });
    });
});
(0, globals_1.describe)('createStorage()', () => {
    (0, globals_1.describe)('.length', () => {
        (0, globals_1.test)('Returns correct length when a key of "length" is set with defineProperty', () => {
            const storageObject = (0, Storage_1.createStorage)();
            (0, globals_1.expect)(storageObject.length).toBe(0);
            Object.defineProperty(storageObject, 'length', {
                value: 100,
                writable: true,
            });
            (0, globals_1.expect)(storageObject.length).toBe(1);
        });
    });
});
