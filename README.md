## @lachlanmcdonald/mock-storage

__mock-storage__ is a implementation of [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API), primarily intended for use in testing/developing code in non-browser environments (where that API is not available, i.e. [localStorage])

__mock-storage__ intends to be side-effect compatible with browser environments, with support for utilising internal methods on the Web Storage instances.

## Usage

 There are two distinct ways to utilise this module:

 ```ts
const storage = createStorage();
const storage = new Storage();
 ```

### createStorage()

`createStorage()` will return a new __Storage__ instance, that is proxied in such a way as to be as close as browser implementations as possible. This instance supports both the [Storage Interface][storage_interface] and JavaScript's internal methods.

For instance:

- `Object.keys()` returns all keys set on the instance.
- `Object.entries()` returns an array of key/value pairs set on the instance.
- `Object.values()` retuns an array of values set on the instance.
- `instance[key]` behaves the same as `getItem()` except for existing methods or properties.
- `instance[key] = value` behaves the same as `setItem()`
- `delete instance[key]` behaves the same as `removeItem()`
- `Object.defineProperty()` and `Object.defineProperties()` behaves the same as `setItem()`
- `{...instance}` will output an object of key/value pairs set on the instance
- `Object.preventExtensions()` will throw a TypeError.
- `Object.setPrototypeOf()` will always fail and return `false`.
- `Object.isExtensible()` is always `true`.
- `Object.getOwnPropertyNames()` returns all keys set on the instance.
- `instance['length']` will return the number of keys set on the instance, even if a key of `length` has been set on the instance.

> Whilst the [Storage Interface][storage_interface] is the preferred method for utilising Storage instances, accessing a Storage instance through other means is unconventional and not recommended, but not disallowed.

### new Storage()

`new Storage();` initialises a new __Storage__ object which is not proxied. As such, this instance only implements the [Storage Interface][storage_interface]:

- `Storage.key()`
- `Storage.getItem()`
- `Storage.setItem()`
- `Storage.removeItem()`
- `Storage.clear()`

 ## Implementation notes

- The key `__unsafeInternalStore` on __Storage__ instances is reserved. Manipulate this key outside of using the [Storage Interface][storage_interface] will likely result in errors or unknown behaviour.
- This implementation is intended for non-browser environments, and as such, does not fire `storage` events or throw `SecurityError` exceptions.
- Storage instances do not have a quote limit and will not throw `QuotaExceededError` exeptions.
- The `configurable`, `enumerable`, `writable` properties are ignored when calling `defineProperty()` on a proxied Storage object. This appears to match browser implementations of this behaviour.
- As there is no trap for `Object.freeze()`, calling `Object.freeze()` will throw the [TypeError] `"Cannot prevent extensions"`, instead of the expected `"Cannot freeze"`.
- As there is no trap for `Object.seal()`, calling `Object.seal()` will throw the [TypeError] `"Cannot prevent extensions"`, instead of the expected `"Cannot seal"`.

## Tests

Tests are run on both JavaScript and TypeScript files using [jest](https://jestjs.io/) and [ts-jest](https://www.npmjs.com/package/ts-jest):

```
npm test
```

[storage_interface]: https://developer.mozilla.org/en-US/docs/Web/API/Storage
[localStorage]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
[TypeError]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError