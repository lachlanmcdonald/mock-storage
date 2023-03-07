/**
 * A mock of the Web Storage API's [Storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage) class,
 * namely used for [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
 */
export default class Storage {
	store: Record<string, any>;

	constructor() {
		this.store = {};
	}

	clear() {
		this.store = {};
	}

	getItem(key: any) {
		key = String(key);

		if (this.store.hasOwnProperty(key)) {
			return this.store[key];
		} else {
			return null;
		}
	}

	setItem(key: any, value: any) {
		this.store[String(key)] = String(value);
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
