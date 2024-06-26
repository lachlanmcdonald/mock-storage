# @lmcd/mock-storage

[![Build](https://github.com/lachlanmcdonald/mock-storage/actions/workflows/build.yml/badge.svg?branch=main)][build-link] [![npm version](https://badge.fury.io/js/%40lmcd%2Fmock-storage.svg)][package-link] [![License](https://img.shields.io/badge/License-MIT-blue.svg)][license-link] 

__mock-storage__ is a implementation of [Web Storage API][web-storage-api] (e.g. [localStorage]), primarily intended for use in development/testing in non-browser environments where the API is not available.

__mock-storage__ intends to be side-effect compatible with browser environments, with support for utilising internal methods on the Web Storage instances. This allows __mock-storage__ to be used in environments where you may not have complete control or visibility over how your storage is being accessed.

## Usage

 There are two distinct ways to utilise this module:

 ```ts
import { createStorage } from "@lmcd/mock-storage";
const storage = createStorage();
 ```
 
 ```ts
import { Storage } from "@lmcd/mock-storage";
const storage = new Storage();
 ```

__@lmcd/mock-storage__ replaces __@lachlanmcdonald/mock-storage__.

### createStorage()

`createStorage()` will return a new __Storage__ instance that is proxied in such a way as to be as close to browser implementations as possible. This instance supports both the [Storage Interface][storage-interface] and utilising JavaScript's internal methods on a __Storage__ instance:

| Method | Behaviour |
| ----- | ----- |
| `Object.keys()` | Returns all keys set on the instance | 
| `Object.entries()` | Returns an array of key/value pairs set on the instance | 
| `Object.values()` | Returns an array of values set on the instance | 
| `instance[key]` | Behaves the same as `getItem()` except for existing methods or properties | 
| `instance[key] = value` | Behaves the same as `setItem()` | 
| `delete instance[key]` | Behaves the same as `removeItem()` | 
| `Object.defineProperty()` <br> `Object.defineProperties()` | Behaves the same as `setItem()` | 
| `{...instance}` | Outputs an object of key/value pairs set on the instance | 
| `Object.preventExtensions()` | Will throw a TypeError. | 
| `Object.setPrototypeOf()` | Will fail and return `false`. | 
| `Object.isExtensible()` | Will always return `true`. | 
| `Object.getOwnPropertyNames()` | Returns all keys set on the instance. | 
| `instance['length']` | Will return the number of keys set on the instance (even if a key of `length` has been added to the storage.) | 

### new Storage()

`new Storage()` initialises a new __Storage__ object that is not proxied. As such, this instance only implements the [Storage Interface][storage-interface]:

- `Storage.key()`
- `Storage.getItem()`
- `Storage.setItem()`
- `Storage.removeItem()`
- `Storage.clear()`
- `Storage.length`

 ## Implementation notes

- This implementation is intended for non-browser environments, and as such, does not fire `storage` events or throw `SecurityError` exceptions. This module is not intended as a browser polyfill.
- Storage instances do not have a quote limit and will not throw `QuotaExceededError` exceptions.
- The `configurable`, `enumerable`, `writeable` properties are ignored when calling `defineProperty()` on a proxied Storage object. This appears to match browser implementations of this behaviour.
- As there is no trap for `Object.freeze()`, calling `Object.freeze()` will throw the [TypeError] _"Cannot prevent extensions"_, instead of the expected _"Cannot freeze"_.
- As there is no trap for `Object.seal()`, calling `Object.seal()` will throw the [TypeError] _"Cannot prevent extensions"_, instead of the expected _"Cannot seal"_.

## Tests

```
npm run build
npm test
```

[build-link]: https://github.com/lachlanmcdonald/mock-storage/actions
[package-link]: https://www.npmjs.com/package/@lmcd/mock-storage
[license-link]: https://github.com/lachlanmcdonald/mock-storage/blob/main/LICENSE
[storage-interface]: https://developer.mozilla.org/en-US/docs/Web/API/Storage
[web-storage-api]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
[localStorage]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
[TypeError]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError
