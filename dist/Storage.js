"use strict";
/*
 * Copyright (c) 2023 Lachlan McDonald. All rights reserved.
 * This file is licensed under the MIT License
 * https://github.com/lachlanmcdonald/mock-storage
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStorage = exports.storageProxyHandler = exports.Storage = void 0;
/**
 * A mock of the Web Storage API's [Storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage) class,
 * namely used for testing against [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) in
 * environments where it does not exist.
 */
class Storage {
    /**
     * Intialises a new instance of __Storage__. In most cases, the __createStorage()__ factory should
     * be used instead when intialising new instances of Storage to ensure the internals are properly proxied.
     */
    constructor() {
        this.__unsafeInternalStore = {};
    }
    /**
     * Removes all data stored in the Storage object.
     */
    clear() {
        this.__unsafeInternalStore = {};
    }
    /**
     * Retrieves the value for provided `key` from the Storage object, or `null` if the key does not exist.
     */
    getItem(key) {
        if (arguments.length === 0) {
            throw new TypeError("Failed to execute 'getItem' on 'Storage': 1 argument required, but only 0 present.");
        }
        key = String(key);
        if (Object.hasOwnProperty.call(this.__unsafeInternalStore, key)) {
            return this.__unsafeInternalStore[key];
        }
        else {
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
    setItem(key, value) {
        if (arguments.length < 2) {
            throw new TypeError("Failed to execute 'setItem' on 'Storage': 2 arguments required, but only 1 present.");
        }
        this.__unsafeInternalStore[String(key)] = String(value);
    }
    /**
     * Removes the provided `key` from the Storage object, if it exists.
     */
    removeItem(key) {
        if (arguments.length === 0) {
            throw new TypeError("Failed to execute 'removeItem' on 'Storage': 1 argument required, but only 0 present.");
        }
        delete this.__unsafeInternalStore[String(key)];
    }
    /**
     * Returns the name of the n&#x1D57;&#x02B0; key in the Storage object.
     *
     * __Implementation notes:__
     * - The order of keys is varies by user-agent and should be not relied upon.
     * - The handling of non-numeric keys is indeterminate.
     */
    key(index) {
        if (arguments.length === 0) {
            throw new TypeError("Failed to execute 'key' on 'Storage': 1 argument required, but only 0 present.");
        }
        const keys = Object.keys(this.__unsafeInternalStore);
        return keys[index] || null;
    }
    /**
     * Returns the number of items stored in the Storage object
     */
    get length() {
        return Object.keys(this.__unsafeInternalStore).length;
    }
    toString() {
        return '[object Storage]';
    }
}
exports.Storage = Storage;
/**
 * The `storageProxyHandler` provides handler functions/traps for the Storage class,
 * so that it can be used with JavaScript's internal methods, such as Object.keys().
 */
exports.storageProxyHandler = {
    ownKeys(target) {
        return Object.keys(target.__unsafeInternalStore);
    },
    get(target, property, receiver) {
        if (Reflect.has(target, property)) {
            const value = Reflect.get(target, property, receiver);
            if (typeof value === 'function') {
                return function () {
                    return value.apply(this, arguments); // eslint-disable-line prefer-rest-params
                }.bind(target);
            }
            else {
                return value;
            }
        }
        else {
            return target.getItem(property);
        }
    },
    set(target, property, value) {
        try {
            target.setItem(property, value);
            return true;
        }
        catch (e) {
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
    has(target, property) {
        if (Reflect.has(target, property)) {
            return true;
        }
        else {
            return typeof target.getItem(property) === 'string';
        }
    },
    deleteProperty(target, property) {
        target.removeItem(property);
        return true;
    },
    getOwnPropertyDescriptor(target, property) {
        if (property !== '__unsafeInternalStore' && Reflect.has(target.__unsafeInternalStore, property)) {
            return {
                configurable: true,
                enumerable: true,
                value: target.getItem(property),
                writable: true,
            };
        }
        else {
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
const createStorage = () => {
    return new Proxy(new Storage(), exports.storageProxyHandler);
};
exports.createStorage = createStorage;
