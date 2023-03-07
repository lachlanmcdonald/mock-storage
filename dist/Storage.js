"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A mock of the Web Storage API's [Storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage) class,
 * namely used for [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
 */
class Storage {
    constructor() {
        this.store = {};
    }
    clear() {
        this.store = {};
    }
    getItem(key) {
        key = String(key);
        if (this.store.hasOwnProperty(key)) {
            return this.store[key];
        }
        else {
            return null;
        }
    }
    setItem(key, value) {
        this.store[String(key)] = String(value);
    }
    removeItem(key) {
        delete this.store[key];
    }
    key(index) {
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
exports.default = Storage;
