/*
 * Copyright (c) 2023 Lachlan McDonald. All rights reserved.
 * This file is licensed under the MIT License
 * https://github.com/lachlanmcdonald/mock-storage
 */

const STORAGE_AREA = new WeakMap<any, Map<string, string>>();

/**
 * A mock of the Web Storage API's [Storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage) class,
 * intended for use in development/testing in non-browser environments.
 * e.g. testing [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) in
 * environments where it does not exist.
 */
export class Storage {
	/**
	 * Initialises a new instance of __Storage__. In most cases, the __createStorage()__ factory should
	 * be used instead when initialising new instances of Storage to ensure the internals are properly proxied.
	 */
	constructor() {
		this.clear();
	}

	/**
	 * Removes all data stored in the Storage object.
	 */
	clear() {
		STORAGE_AREA.set(this, new Map());
	}

	/**
	 * Retrieves the value for provided `key` from the Storage object, or `null` if the key does not exist.
	 */
	getItem(key: any) {
		if (arguments.length === 0) {
			throw new TypeError("Failed to execute 'getItem' on 'Storage': 1 argument required, but only 0 present.");
		}

		key = String(key);

		const area = STORAGE_AREA.get(this);

		if (area!.has(key)) {
			return area!.get(key);
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
		if (arguments.length < 2) {
			throw new TypeError("Failed to execute 'setItem' on 'Storage': 2 arguments required, but only 1 present.");
		}

		STORAGE_AREA.get(this)!.set(String(key), String(value));
	}

	/**
	 * Removes the provided `key` from the Storage object, if it exists.
	 */
	removeItem(key: any) {
		if (arguments.length === 0) {
			throw new TypeError("Failed to execute 'removeItem' on 'Storage': 1 argument required, but only 0 present.");
		}

		STORAGE_AREA.get(this)!.delete(key);
	}

	/**
	 * Returns the name of the n&#x1D57;&#x02B0; key in the Storage object.
	 *
	 * __Implementation notes:__
	 * - The order of keys is varies by user-agent and should be not relied upon.
	 * - The handling of non-numeric keys is indeterminate.
	 */
	key(index: any) {
		if (arguments.length === 0) {
			throw new TypeError("Failed to execute 'key' on 'Storage': 1 argument required, but only 0 present.");
		}

		const keys = Array.from(STORAGE_AREA.get(this)!.keys());
		return keys[index] ? STORAGE_AREA.get(this)!.get(keys[index]) : null;
	}

	/**
	 * Returns the number of items stored in the Storage object
	 */
	get length() {
		return STORAGE_AREA.get(this)!.size;
	}

	toString() {
		return '[object Storage]';
	}
}

/**
 * The __storageProxyHandler__ provides handler functions/traps for the Storage class,
 * so that it can be used with JavaScript's internal methods, such as `Object.keys()`.
 */
export const storageProxyHandler: ProxyHandler<Storage> = {
	ownKeys(target: Storage) {
		return Array.from(STORAGE_AREA.get(target)!.keys());
	},
	get(target: Storage, property: any) {
		if (Reflect.has(target, property)) {
			const value: any = Reflect.get(target, property, target);

			if (typeof value === 'function') {
				return function () {
					// @ts-expect-error Intentional function reflection
					return value.apply(this, arguments); // eslint-disable-line prefer-rest-params
				}.bind(target);
			} else {
				return value;
			}
		} else {
			return target.getItem(property);
		}
	},
	set(target: Storage, property: any, value: any) {
		try {
			target.setItem(property, value);
			return true;
		} catch (e) {
			return false;
		}
	},
	defineProperty(target, property, descriptor) {
		if (typeof descriptor.get === 'function' || typeof descriptor.set === 'function') {
			throw new TypeError("Failed to set a named property on 'Storage': Accessor properties are not allowed.");
		}
		target.setItem(property, descriptor.value);
		return true;
	},
	has(target: Storage, property: any) {
		if (Reflect.has(target, property)) {
			return true;
		} else {
			return typeof target.getItem(property) === 'string';
		}
	},
	deleteProperty(target: Storage, property: any) {
		target.removeItem(property);
		return true;
	},
	getOwnPropertyDescriptor(target: Storage, property: any): PropertyDescriptor | undefined {
		if (STORAGE_AREA.get(target)!.has(property)) {
			return {
				configurable: true,
				enumerable: true,
				value: STORAGE_AREA.get(target)!.get(property),
				writable: true,
			};
		} else {
			return undefined; // eslint-disable-line no-undefined
		}
	},
	isExtensible() {
		return true;
	},
	preventExtensions() {
		throw new TypeError('Cannot prevent extensions');
	},
	getPrototypeOf() {
		return Storage;
	},
	setPrototypeOf() {
		return false;
	},
};

export type ProxiedStorage = Storage & Record<any, unknown>;

export const createStorage = () => {
	return new Proxy(new Storage(), storageProxyHandler) as ProxiedStorage; // eslint-disable-line no-undef
};
