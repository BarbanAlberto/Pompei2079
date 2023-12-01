/**
 * @template T
 * @param {?T} x
 */
 function assertNotNull(x) {
  if (x === null) throw new TypeError("Assertion failed: value is null");
  return x;
}

/**
 * @template T
 * @param {T | undefined} x
 */
 function assertNotUndefined(x) {
  if (x === undefined) throw new TypeError("Assertion failed: value is undefined");
  return x;
}

/**
 * @template T
 * @param {unknown} x
 * @param {new () => T} T
 */
function assertInstanceOf(x, T) {
  if (!(x instanceof T)) throw new TypeError(`Assertion failed: value not an instance of ${T.name}`);
  return x;
}

///** @param {any} key */
/*Map.prototype.getOrThrow = function(key) {
  if (!this.has(key)) throw new TypeError(`Key ${key} not present`);
  return this.get(key);
};*/
