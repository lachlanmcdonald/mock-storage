/*
 * Copyright (c) 2023 Lachlan McDonald. All rights reserved.
 * This file is licensed under the MIT License
 * https://github.com/lachlanmcdonald/mock-storage
 */
const STORAGE_AREAS = new WeakMap<object, Map<string, string>>();

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
		STORAGE_AREAS.set(this, new Map());
	}

	/**
	 * Removes all data stored in the Storage object.
	 */
	clear() {
		STORAGE_AREAS.get(this)!.clear();
	}

	/**
	 * Retrieves the value for provided `key` from the Storage object, or `null` if the key does not exist.
	 */
	getItem(key: unknown) {
		if (arguments.length === 0) {
			throw new TypeError("Failed to execute 'getItem' on 'Storage': 1 argument required, but only 0 present.");
		}

		const area = STORAGE_AREAS.get(this);

		if (area!.has(String(key))) {
			const value = area!.get(String(key));

			return typeof value === 'undefined' ? null : value;
		} else {
			return null;
		}
	}

	/**
	 * Sets the provided `key` to the provided `value` in the Storage object. Existing values are replaced.
	 *
	 * - This implementation does not enforce storage limits, and as such, will not throw an exception for
	 *   exceeding the storage limit.
	 */
	setItem(key: unknown, value: unknown) {
		if (arguments.length < 2) {
			throw new TypeError("Failed to execute 'setItem' on 'Storage': 2 arguments required, but only 1 present.");
		}

		STORAGE_AREAS.get(this)!.set(String(key), String(value));
	}

	/**
	 * Removes the provided `key` from the Storage object, if it exists.
	 */
	removeItem(key: unknown) {
		if (arguments.length === 0) {
			throw new TypeError("Failed to execute 'removeItem' on 'Storage': 1 argument required, but only 0 present.");
		}

		STORAGE_AREAS.get(this)!.delete(String(key));
	}

	/**
	 * Returns the name of the nth key in the Storage object.
	 *
	 * - The order of keys is implementation-dependant and should be not relied upon.
	 * - Non-finite keys are allowed but are implementation-dependant and should be not relied upon.
	 */
	key(index: unknown) {
		if (arguments.length === 0) {
			throw new TypeError("Failed to execute 'key' on 'Storage': 1 argument required, but only 0 present.");
		}

		if (Number.isFinite(index)) {
			const keys = Array.from(STORAGE_AREAS.get(this)!.keys());
			return keys[index as number] ? STORAGE_AREAS.get(this)!.get(keys[index as number]) : null;
		} else {
			return null;
		}
	}

	/**
	 * Returns the number of items stored in the Storage object
	 */
	get length() {
		return STORAGE_AREAS.get(this)!.size;
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
		return Array.from(STORAGE_AREAS.get(target)!.keys());
	},
	get(target: Storage, property: unknown) {
		const isPropertyKey = Number.isFinite(property) || typeof property === 'string' || property instanceof Symbol;

		if (isPropertyKey && (property as PropertyKey) in target) {
			const value: unknown = Reflect.get(target, property as PropertyKey, target);

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
	set(target: Storage, property: unknown, value: unknown) {
		try {
			target.setItem(property, value);
			return true;
		} catch (e) { // eslint-disable-line @typescript-eslint/no-unused-vars
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
	has(target: Storage, property: unknown) {
		const isPropertyKey = Number.isFinite(property) || typeof property === 'string' || property instanceof Symbol;

		if (isPropertyKey && (property as PropertyKey) in target) {
			return true;
		} else {
			return typeof target.getItem(property) === 'string';
		}
	},
	deleteProperty(target: Storage, property: unknown) {
		target.removeItem(property);
		return true;
	},
	getOwnPropertyDescriptor(target: Storage, property: unknown): PropertyDescriptor | undefined {
		if (typeof property === 'string' && STORAGE_AREAS.get(target)!.has(property)) {
			return {
				configurable: true,
				enumerable: true,
				value: STORAGE_AREAS.get(target)!.get(property),
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

export type ProxiedStorage = Storage & {
  [key: string]: string | null;
  [key: number]: string | null;
  [key: symbol]: string | null;
};

export const createStorage = () => {
	return new Proxy(new Storage(), storageProxyHandler) as ProxiedStorage;
};
