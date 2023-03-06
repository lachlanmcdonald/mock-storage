/**
 * A quirk of [Storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage) is that
 * it accepts all types for the keys, but unlike a [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), will silenty call `toString()` on the value
 * and use that result as the key.
 */
export function convert(key: any): string {
	if (key === null) {
		return "null";
	} else if (typeof key === 'undefined') {
		return 'undefined';
	} else {
		return key.toString();
	}
}

/**
 * A mock of the Web Storage API's [Storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage) class,
 * namely used for [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
 *
 * **Note:** This class is intended solely for tests. Do not use in production.
 */
export class MockStorage {
	store: Record<string, any>;

	constructor() {
		this.store = {};
	}

	clear() {
		this.store = {};
	}

	getItem(key: any) {
		key = convert(key);

		if (this.store.hasOwnProperty(key)) {
			return this.store[key];
		} else {
			return null;
		}
	}

	setItem(key: any, value: any) {
		this.store[convert(key)] = convert(value);
	}

	removeItem(key: string) {
		delete this.store[key];
	}

	key(index: number) {
		const keys = Object.keys(this.store);
		return keys[index] || null;
	}

	get length() {
		return Object.keys(this.store).length;
	}

	toString() {
		return '[object Storage]';
	}
}
