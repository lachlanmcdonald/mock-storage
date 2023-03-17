/*
 * Copyright (c) 2023 Lachlan McDonald. All rights reserved.
 * This file is licensed under the MIT License
 * https://github.com/lachlanmcdonald/mock-storage
 */

/**
 * A mock of the Web Storage API's [Storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage) class,
 * namely used for testing against [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) in
 * environments where it does not exist.
 *
 * __Implementation notes:__
 * - This implementation is intended for non-browser environments, and as such, does not fire `storage` events.
 */
export default class Storage {
	store: Record<string, any>;

	/**
	 * Intialises a new instance of __Storage__. In most cases, the __createStorage()__ factory should
	 * be used instead when intialising new instances of Storage to ensure the internals are properly proxied.
	 */
	constructor() {
		this.store = {};
	}

	/**
	 * Removes all data stored in the Storage object.
	 */
	clear() {
		this.store = {};
	}

	/**
	 * Retrieves the value for provided `key` from the Storage object, or `null` if the key does not exist.
	 */
	getItem(key: any) {
		key = String(key);

		if (this.store.hasOwnProperty(key)) {
			return this.store[key];
		} else {
			return null;
		}
	}

	/**
	 * Sets the provided `key` to the provided `value` in the Storage object. Existing values are replaced.
	 *
	 * __Implementation notes:__
	 * - This implementation does not enforce storage limits, and as such, will not
	 *   throw an exception for exceeding the storage limit.
	 */
	setItem(key: any, value: any) {
		this.store[String(key)] = String(value);
	}

	removeItem(key: string) {
		delete this.store[key];
	}

	/**
	 * Returns the name of the n&#x1D57;&#x02B0; key in the Storage object.
	 *
	 * __Implementation notes:__
	 * - The order of keys is varies by user-agent and should be not relied upon.
	 * - The handling of non-numeric keys is indeterminate.
	 */
	key(index: any) {

		return keys[index] || null;
	}

	get length() {
		return Object.keys(this.store).length;
	}

	toString() {
		return '[object Storage]';
	}
}
