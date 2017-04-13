
/*
 * memop v1.1.0
 * (c) 2017 @Johnny Wu
 * Released under the MIT License.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class FixedArray {
  constructor(size) {
    this._count = 0;
    this._data = new Array(size);
  }

  _resize (size) {
    if (size > this._data.length) {
      for (let i = this._data.length; i < size; ++i) {
        this._data[i] = this._fn();
      }
    }
  }

  get length () {
    return this._count;
  }

  get data () {
    return this._data;
  }

  reset() {
    for (let i = 0; i < this._count; ++i) {
      this._data[i] = undefined;
    }

    this._count = 0;
  }

  push(val) {
    if (this._count >= this._data.length) {
      this._resize(this._data.length * 2);
    }

    this._data[this._count] = val;
    ++this._count;
  }

  pop() {
    --this._count;

    if (this._count < 0) {
      this._count = 0;
    }
    this._data[this._count] = undefined;
  }

  fastRemove(idx) {
    if ( idx >= this._count ) {
      return;
    }

    let last = this._count-1;
    this._data[idx] = this._data[last];
    this._data[last] = undefined;
    this._count -= 1;
  }
}

class Pool {
  constructor(fn, size) {
    this._fn = fn;
    this._idx = size-1;
    this._frees = new Array(size);

    for (let i = 0; i < size; ++i) {
      this._frees[i] = fn();
    }
  }

  _expand (size) {
    let old = this._frees;
    this._frees = new Array(size);

    let len = size-old.length;
    for (let i = 0; i < len; ++i) {
      this._frees[i] = this._fn();
    }

    for (let i = len, j=0; i < size; ++i, ++j) {
      this._frees[i] = old[j];
    }

    this._idx += len;
  }

  alloc () {
    // create some more space (expand by 20%, minimum 1)
    if (this._idx < 0) {
      this._expand(Math.round(this._frees.length * 1.2) + 1);
    }

    return this._frees[this._idx--];
  }

  free (obj) {
    ++this._idx;
    this._frees[this._idx] = obj;
  }
}

class FramePool {
  constructor(fn, size) {
    this._fn = fn;
    this._count = 0;
    this._data = new Array(size);

    for (let i = 0; i < size; ++i) {
      this._data[i] = fn();
    }
  }

  _resize (size) {
    if (size > this._data.length) {
      for (let i = this._data.length; i < size; ++i) {
        this._data[i] = this._fn();
      }
    }
  }

  alloc () {
    if (this._count >= this._data.length) {
      this._resize(this._data.length * 2);
    }
    return this._data[this._count++];
  }

  reset () {
    this._count = 0;
  }
}

exports.FixedArray = FixedArray;
exports.Pool = Pool;
exports.FramePool = FramePool;
//# sourceMappingURL=memop.js.map
