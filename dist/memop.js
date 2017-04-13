
/*
 * memop v1.0.0
 * (c) 2017 @Johnny Wu
 * Released under the MIT License.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

exports.Pool = Pool;
exports.FramePool = FramePool;
//# sourceMappingURL=memop.js.map
