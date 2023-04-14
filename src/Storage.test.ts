/*
 * Copyright (c) 2023 Lachlan McDonald. All rights reserved.
 * This file is licensed under the MIT License
 * https://github.com/lachlanmcdonald/mock-storage
 */
import {describe, beforeEach, expect, test} from '@jest/globals';
import { Storage, ProxiedStorage, createStorage } from './Storage';

const Conversion: Array<Array<any>> = [
	['"test"', 'test', 'test'],
	['123', 123, '123'],
	['123.059', 123.059, '123.059'],
	['true', true, 'true'],
	['false', false, 'false'],
	['null', null, 'null'],
	['undefined', undefined, 'undefined'], // eslint-disable-line no-undefined
	['an object', {}, '[object Object]'],
	['an empty array', [], ''],
	['an array', [1, 2, 3], '1,2,3'],
	['a function', () => {}, /^\s*\(\)\s*=>\s*\{\s*\}\s*$/u], // eslint-disable-line no-empty-function, @typescript-eslint/no-empty-function
];

const CREATES_STORAGE = Symbol();
const NEW_STORAGE = Symbol();

describe.each([
	['createStorage()', CREATES_STORAGE],
	['new Storage()', NEW_STORAGE],
])('%s', (_message, type) => {
	let storageObject: Storage;

	beforeEach(() => {
		if (type === CREATES_STORAGE) {
			storageObject = createStorage();
		} else if (type === NEW_STORAGE) {
			storageObject = new Storage();
		}
	});

	test('Empty store on initialisation', () => {
		expect(storageObject.length).toBe(0);
	});

	test('.toString() returns "[object Storage]"', () => {
		expect(storageObject.toString()).toBe('[object Storage]');
	});

	describe('.clear()', () => {
		test('clear() removes all items from storage', () => {
			expect(storageObject.length).toBe(0);
			storageObject.setItem('test', 123);
			expect(storageObject.length).toBe(1);
			storageObject.clear();
			expect(storageObject.length).toBe(0);
		});
	});

	describe('.getItem()', () => {
		test('Returns "null" for non-existent key', () => {
			expect(storageObject.getItem('test')).toBe(null);
		});

		test.each(Conversion)('Converts %s to a string before retrieving', (_message, key) => {
			storageObject.setItem(key, 'test');
			expect(storageObject.getItem(key)).toBe('test');
		});
	});

	describe('.setItem()', () => {
		test.each(Conversion)('Converts %s to a string before setting', (_message, input, expected) => {
			storageObject.setItem('test', input);

			if (expected instanceof RegExp) {
				expect(storageObject.getItem('test')).toMatch(expected);
			} else {
				expect(storageObject.getItem('test')).toBe(expected);
			}
		});
	});

	describe('.length', () => {
		test('Returns a length of zero for empty storage', () => {
			expect(storageObject.length).toBe(0);
		});

		test('Returns a length of 1 when an item is set', () => {
			storageObject.setItem('test', 123);
			expect(storageObject.length).toBe(1);
		});

		test('Returns correct length when a key of "length" is set with setItem', () => {
			expect(storageObject.length).toBe(0);
			storageObject.setItem('length', 100);
			expect(storageObject.length).toBe(1);
		});
	});

	describe('.removeItem()', () => {
		test('Returns the previous length when an item is set then removed', () => {
			storageObject.setItem('a', 123);
			const length = storageObject.length;

			storageObject.setItem('b', 123);
			storageObject.removeItem('b');
			expect(storageObject.length).toBe(length);
		});

		test('Returns a length of zero removing an non-existent item', () => {
			storageObject.removeItem('test');
			expect(storageObject.length).toBe(0);
		});
	});
});

describe('createStorage()', () => {
	describe('.length', () => {
		test('Returns correct length when a key of "length" is set with defineProperty', () => {
			const storageObject = createStorage();

			expect(storageObject.length).toBe(0);
			Object.defineProperty(storageObject, 'length', {
				value: 100,
				writable: true,
			});
			expect(storageObject.length).toBe(1);
		});
	});

	describe('Property accessors', () => {
		test('Set value using property accessor', () => {
			const storageObject = createStorage();

			storageObject.test = 123;
			expect(storageObject.test).toBe('123');
		});

		test('Setting .length does not break .length accessor', () => {
			const storageObject = createStorage();

			expect(storageObject.length).toBe(0);

			// @ts-expect-error Intentionally incorrect assignment
			storageObject.length = 123;

			expect(storageObject.length).toBe(1);
			expect(storageObject.getItem('length')).toBe('123');
		});

		test.each([
			'clear',
			'getItem',
			'setItem',
			'removeItem',
			'key',
			'toString',
		])('Cannot assign to .%s()', (name: string) => {
			const storageObject = createStorage();

			const k = typeof storageObject[name];

			storageObject[name] = 123;

			expect(typeof storageObject[name]).toBe(k);
			expect(storageObject.getItem(name)).toBe('123');
		});

		test('Non-existant key returns null using property accessor', () => {
			const storageObject = createStorage();

			expect(storageObject.test).toBe(null);
		});

		test('Remove value using delete keyword', () => {
			const storageObject = createStorage();

			expect(storageObject.test).toBe(null);

			storageObject.test = 123;
			expect(storageObject.test).toBe('123');

			delete storageObject.test;
			expect(storageObject.test).toBe(null);
		});
	});
});

describe('createStorage()', () => {
	let storageObject: ProxiedStorage;

	beforeEach(() => {
		storageObject = createStorage();

		expect(storageObject.length).toBe(0);

		storageObject.a = 123;
		storageObject.setItem('b', 456);
	});

	describe('Object.keys()', () => {
		test('Object.keys() returns all set keys.', () => {
			const keys = Object.keys(storageObject);

			expect(keys).toHaveLength(2);
			expect(keys).toContainEqual('a');
			expect(keys).toContainEqual('b');
		});
	});

	describe('Object.entries()', () => {
		test('Object.entries() returns an array of key/value pairs.', () => {
			const entries = Object.entries(storageObject);

			expect(entries).toHaveLength(2);
			expect(entries[0]).toMatchObject(['a', '123'] as [string, any]);
			expect(entries[1]).toMatchObject(['b', '456'] as [string, any]);
		});
	});

	describe('Object.values()', () => {
		test('Object.values() retuns an array of values.', () => {
			const values = Object.values(storageObject);

			expect(values).toHaveLength(2);
			expect(values).toContainEqual('123');
			expect(values).toContainEqual('456');
		});
	});
});
