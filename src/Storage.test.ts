/*
 * Copyright (c) 2023 Lachlan McDonald. All rights reserved.
 * This file is licensed under the MIT License
 * https://github.com/lachlanmcdonald/mock-storage
 */
import {describe, expect, test} from '@jest/globals';
import Storage from './Storage';

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

describe('new Storage()', () => {
	test('Empty store on initialisation', () => {
		const k = new Storage();

		expect(k.length).toBe(0);
	});
});

describe('.toString()', () => {
	test('toString() returns "[object Storage]"', () => {
		const k = new Storage();

		expect(k.toString()).toBe('[object Storage]');
	});
});

describe('.clear()', () => {
	test('clear() removes any items in storage', () => {
		const k = new Storage();

		expect(k.length).toBe(0);
		k.setItem('test', 123);
		expect(k.length).toBe(1);
		k.clear();
		expect(k.length).toBe(0);
	});
});

describe('.getItem()', () => {
	test('Returns "null" for non-existent key', () => {
		const k = new Storage();

		expect(k.getItem('test')).toBe(null);
	});

	test.each(Conversion)('Converts %s to a string before retrieving', (_message, key) => {
		const k = new Storage();

		k.setItem(key, 'test');
		expect(k.getItem(key)).toBe('test');
	});
});

describe('.setItem()', () => {
	test.each(Conversion)('Converts %s to a string before setting', (_message, input, expected) => {
		const k = new Storage();

		k.setItem('test', input);

		if (expected instanceof RegExp) {
			expect(k.getItem('test')).toMatch(expected);
		} else {
			expect(k.getItem('test')).toBe(expected);
		}
	});
});

describe('.length', () => {
	test('Returns a length of zero for empty storage', () => {
		const k = new Storage();

		expect(k.length).toBe(0);
	});

	test('Returns a length of 1 when an item is set', () => {
		const k = new Storage();

		k.setItem('test', 123);
		expect(k.length).toBe(1);
	});
});

describe('.removeItem()', () => {
	test('Returns the previous lngth when an item is set then removed', () => {
		const k = new Storage();

		k.setItem('a', 123);
		const length = k.length;

		k.setItem('b', 123);
		k.removeItem('b');
		expect(k.length).toBe(length);
	});

	test('Returns a length of zero removing an non-existent item', () => {
		const k = new Storage();

		k.removeItem('test');
		expect(k.length).toBe(0);
	});
});
