
/*
 * memop v1.4.1
 * (c) 2017 @Johnny Wu
 * Released under the MIT License.
 */

(function (exports) {
'use strict';

function _compare(a, b) {
  return a - b;
}

/**
 * _swap the places of two elements
 *
 * @private
 * @param {array} array The array which contains the elements
 * @param {number} i The index of the first element
 * @param {number} j The index of the second element
 * @returns {array} array The array with swaped elements
 */
function _swap(array, i, j) {
  let temp = array[i];
  array[i] = array[j];
  array[j] = temp;

  return array;
}

/**
 * Partitions given subarray using Lomuto's partitioning algorithm.
 *
 * @private
 * @param {array} array Input array
 * @param {number} left The start of the subarray
 * @param {number} right The end of the subarray
 */
function _partition(array, left, right, cmp) {
  let cmpVal = array[right - 1];
  let minEnd = left;
  let maxEnd;

  for (maxEnd = left; maxEnd < right - 1; maxEnd += 1) {
    if (cmp(array[maxEnd], cmpVal) < 0) {
      _swap(array, maxEnd, minEnd);
      minEnd += 1;
    }
  }
  _swap(array, minEnd, right - 1);

  return minEnd;
}

/**
 * Sorts given array.
 *
 * @private
 * @param {array} array Array which should be sorted
 * @param {number} left The start of the subarray which should be handled
 * @param {number} right The end of the subarray which should be handled
 * @returns {array} array Sorted array
 */
function _quickSort(array, left, right, cmp) {
  if (left < right) {
    let p = _partition(array, left, right, cmp);
    _quickSort(array, left, p, cmp);
    _quickSort(array, p + 1, right, cmp);
  }

  return array;
}

/**
 * Calls the _quickSort function with it's initial values.
 *
 * @public
 * @param {array} array The input array which should be sorted
 * @param {Number} from
 * @param {Number} to
 * @param {Function} cmp
 * @returns {array} array Sorted array
 */
var quickSort = function (array, from, to, cmp) {
  if (from === undefined) {
    from = 0;
  }

  if (to === undefined) {
    to = array.length;
  }

  if (cmp === undefined) {
    cmp = _compare;
  }

  return _quickSort(array, from, to, cmp);
};

class FixedArray {
  constructor(size) {
    this._count = 0;
    this._data = new Array(size);
  }

  _resize(size) {
    if (size > this._data.length) {
      for (let i = this._data.length; i < size; ++i) {
        this._data[i] = undefined;
      }
    }
  }

  get length() {
    return this._count;
  }

  get data() {
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

    let ret = this._data[this._count];
    this._data[this._count] = undefined;

    return ret;
  }

  fastRemove(idx) {
    if (idx >= this._count) {
      return;
    }

    let last = this._count - 1;
    this._data[idx] = this._data[last];
    this._data[last] = undefined;
    this._count -= 1;
  }

  indexOf(val) {
    let idx = this._data.indexOf(val);
    if (idx >= this._count) {
      return -1;
    }

    return idx;
  }

  sort(cmp) {
    return quickSort(this._data, 0, this._count, cmp);
  }
}

class Pool {
  constructor(fn, size) {
    this._fn = fn;
    this._idx = size - 1;
    this._frees = new Array(size);

    for (let i = 0; i < size; ++i) {
      this._frees[i] = fn();
    }
  }

  _expand(size) {
    let old = this._frees;
    this._frees = new Array(size);

    let len = size - old.length;
    for (let i = 0; i < len; ++i) {
      this._frees[i] = this._fn();
    }

    for (let i = len, j = 0; i < size; ++i, ++j) {
      this._frees[i] = old[j];
    }

    this._idx += len;
  }

  alloc() {
    // create some more space (expand by 20%, minimum 1)
    if (this._idx < 0) {
      this._expand(Math.round(this._frees.length * 1.2) + 1);
    }

    let ret = this._frees[this._idx];
    this._frees[this._idx] = null;
    --this._idx;

    return ret;
  }

  free(obj) {
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

  _resize(size) {
    if (size > this._data.length) {
      for (let i = this._data.length; i < size; ++i) {
        this._data[i] = this._fn();
      }
    }
  }

  alloc() {
    if (this._count >= this._data.length) {
      this._resize(this._data.length * 2);
    }
    return this._data[this._count++];
  }

  reset() {
    this._count = 0;
  }

  get length() {
    return this._count;
  }

  get data() {
    return this._data;
  }
}

class RecyclePool {
  constructor(fn, size) {
    this._fn = fn;
    this._count = 0;
    this._data = new Array(size);

    for (let i = 0; i < size; ++i) {
      this._data[i] = fn();
    }
  }

  get length() {
    return this._count;
  }

  get data() {
    return this._data;
  }

  reset() {
    this._count = 0;
  }

  resize(size) {
    if (size > this._data.length) {
      for (let i = this._data.length; i < size; ++i) {
        this._data[i] = this._fn();
      }
    }
  }

  add() {
    if (this._count >= this._data.length) {
      this.resize(this._data.length * 2);
    }

    let ret = this._data[this._count];
    ++this._count;

    return ret;
  }

  remove(idx) {
    if (idx >= this._count) {
      return;
    }

    let last = this._count - 1;
    let tmp = this._data[idx];
    this._data[idx] = this._data[last];
    this._data[last] = tmp;
    this._count -= 1;
  }

  sort(cmp) {
    return quickSort(this._data, 0, this._count, cmp);
  }
}

let _bufferPools = Array(8);
for (let i = 0; i < 8; ++i) {
  _bufferPools[i] = [];
}

function _nextPow16(v) {
  for (let i = 16; i <= (1 << 28); i *= 16) {
    if (v <= i) {
      return i;
    }
  }
  return 0;
}

function _log2(v) {
  let r, shift;
  r = (v > 0xFFFF) << 4; v >>>= r;
  shift = (v > 0xFF) << 3; v >>>= shift; r |= shift;
  shift = (v > 0xF) << 2; v >>>= shift; r |= shift;
  shift = (v > 0x3) << 1; v >>>= shift; r |= shift;
  return r | (v >> 1);
}

function _alloc(n) {
  let sz = _nextPow16(n);
  let bin = _bufferPools[_log2(sz) >> 2];
  if (bin.length > 0) {
    return bin.pop();
  }
  return new ArrayBuffer(sz);
}

function _free(buf) {
  _bufferPools[_log2(buf.byteLength) >> 2].push(buf);
}

var typedArrayPool = {
  alloc_int8(n) {
    let result = new Int8Array(_alloc(n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_uint8(n) {
    let result = new Uint8Array(_alloc(n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_int16(n) {
    let result = new Int16Array(_alloc(2 * n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_uint16(n) {
    let result = new Uint16Array(_alloc(2 * n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_int32(n) {
    let result = new Int32Array(_alloc(4 * n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_uint32(n) {
    let result = new Uint32Array(_alloc(4 * n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_float32(n) {
    let result = new Float32Array(_alloc(4 * n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_float64(n) {
    let result = new Float64Array(_alloc(8 * n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_dataview(n) {
    let result = new DataView(_alloc(n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  free(array) {
    _free(array.buffer);
  },

  reset() {
    let _bufferPools = Array(8);
    for (let i = 0; i < 8; ++i) {
      _bufferPools[i] = [];
    }
  },
};

exports.FixedArray = FixedArray;
exports.Pool = Pool;
exports.FramePool = FramePool;
exports.RecyclePool = RecyclePool;
exports.TypedArrayPool = typedArrayPool;

}((this.memop = this.memop || {})));
//# sourceMappingURL=memop.dev.js.map
