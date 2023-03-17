/*
 * Copyright (c) 2023 Lachlan McDonald. All rights reserved.
 * This file is licensed under the MIT License
 * https://github.com/lachlanmcdonald/mock-storage
 */
import {describe, beforeEach, expect, test} from '@jest/globals';
import { Storage, createStorage } from './Storage';

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

describe.each([
	['createStorage()', 0],
	['new Storage()', 1],
])('%s', (_message, type) => {
	let storageObject: Storage;

	beforeEach(() => {
		if (type === 0) {
			storageObject = createStorage();
		} else if (type === 1) {
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
	});

	describe('.removeItem()', () => {
		test('Returns the previous lngth when an item is set then removed', () => {
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
