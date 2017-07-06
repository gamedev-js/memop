
/*
 * memop v1.4.3
 * (c) 2017 @Johnny Wu
 * Released under the MIT License.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
  var temp = array[i];
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
  var cmpVal = array[right - 1];
  var minEnd = left;
  var maxEnd;

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
    var p = _partition(array, left, right, cmp);
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

var FixedArray = function FixedArray(size) {
  this._count = 0;
  this._data = new Array(size);
};

var prototypeAccessors = { length: {},data: {} };

FixedArray.prototype._resize = function _resize (size) {
    var this$1 = this;

  if (size > this._data.length) {
    for (var i = this._data.length; i < size; ++i) {
      this$1._data[i] = undefined;
    }
  }
};

prototypeAccessors.length.get = function () {
  return this._count;
};

prototypeAccessors.data.get = function () {
  return this._data;
};

FixedArray.prototype.reset = function reset () {
    var this$1 = this;

  for (var i = 0; i < this._count; ++i) {
    this$1._data[i] = undefined;
  }

  this._count = 0;
};

FixedArray.prototype.push = function push (val) {
  if (this._count >= this._data.length) {
    this._resize(this._data.length * 2);
  }

  this._data[this._count] = val;
  ++this._count;
};

FixedArray.prototype.pop = function pop () {
  --this._count;

  if (this._count < 0) {
    this._count = 0;
  }

  var ret = this._data[this._count];
  this._data[this._count] = undefined;

  return ret;
};

FixedArray.prototype.fastRemove = function fastRemove (idx) {
  if (idx >= this._count) {
    return;
  }

  var last = this._count - 1;
  this._data[idx] = this._data[last];
  this._data[last] = undefined;
  this._count -= 1;
};

FixedArray.prototype.indexOf = function indexOf (val) {
  var idx = this._data.indexOf(val);
  if (idx >= this._count) {
    return -1;
  }

  return idx;
};

FixedArray.prototype.sort = function sort (cmp) {
  return quickSort(this._data, 0, this._count, cmp);
};

Object.defineProperties( FixedArray.prototype, prototypeAccessors );

var Pool = function Pool(fn, size) {
  var this$1 = this;

  this._fn = fn;
  this._idx = size - 1;
  this._frees = new Array(size);

  for (var i = 0; i < size; ++i) {
    this$1._frees[i] = fn();
  }
};

Pool.prototype._expand = function _expand (size) {
    var this$1 = this;

  var old = this._frees;
  this._frees = new Array(size);

  var len = size - old.length;
  for (var i = 0; i < len; ++i) {
    this$1._frees[i] = this$1._fn();
  }

  for (var i$1 = len, j = 0; i$1 < size; ++i$1, ++j) {
    this$1._frees[i$1] = old[j];
  }

  this._idx += len;
};

Pool.prototype.alloc = function alloc () {
  // create some more space (expand by 20%, minimum 1)
  if (this._idx < 0) {
    this._expand(Math.round(this._frees.length * 1.2) + 1);
  }

  var ret = this._frees[this._idx];
  this._frees[this._idx] = null;
  --this._idx;

  return ret;
};

Pool.prototype.free = function free (obj) {
  ++this._idx;
  this._frees[this._idx] = obj;
};

var FramePool = function FramePool(fn, size) {
  var this$1 = this;

  this._fn = fn;
  this._count = 0;
  this._data = new Array(size);

  for (var i = 0; i < size; ++i) {
    this$1._data[i] = fn();
  }
};

var prototypeAccessors$1 = { length: {},data: {} };

FramePool.prototype._resize = function _resize (size) {
    var this$1 = this;

  if (size > this._data.length) {
    for (var i = this._data.length; i < size; ++i) {
      this$1._data[i] = this$1._fn();
    }
  }
};

FramePool.prototype.alloc = function alloc () {
  if (this._count >= this._data.length) {
    this._resize(this._data.length * 2);
  }
  return this._data[this._count++];
};

FramePool.prototype.reset = function reset () {
  this._count = 0;
};

prototypeAccessors$1.length.get = function () {
  return this._count;
};

prototypeAccessors$1.data.get = function () {
  return this._data;
};

Object.defineProperties( FramePool.prototype, prototypeAccessors$1 );

var RecyclePool = function RecyclePool(fn, size) {
  var this$1 = this;

  this._fn = fn;
  this._count = 0;
  this._data = new Array(size);

  for (var i = 0; i < size; ++i) {
    this$1._data[i] = fn();
  }
};

var prototypeAccessors$2 = { length: {},data: {} };

prototypeAccessors$2.length.get = function () {
  return this._count;
};

prototypeAccessors$2.data.get = function () {
  return this._data;
};

RecyclePool.prototype.reset = function reset () {
  this._count = 0;
};

RecyclePool.prototype.resize = function resize (size) {
    var this$1 = this;

  if (size > this._data.length) {
    for (var i = this._data.length; i < size; ++i) {
      this$1._data[i] = this$1._fn();
    }
  }
};

RecyclePool.prototype.add = function add () {
  if (this._count >= this._data.length) {
    this.resize(this._data.length * 2);
  }

  var ret = this._data[this._count];
  ++this._count;

  return ret;
};

RecyclePool.prototype.remove = function remove (idx) {
  if (idx >= this._count) {
    return;
  }

  var last = this._count - 1;
  var tmp = this._data[idx];
  this._data[idx] = this._data[last];
  this._data[last] = tmp;
  this._count -= 1;
};

RecyclePool.prototype.sort = function sort (cmp) {
  return quickSort(this._data, 0, this._count, cmp);
};

Object.defineProperties( RecyclePool.prototype, prototypeAccessors$2 );

var _bufferPools = Array(8);
for (var i = 0; i < 8; ++i) {
  _bufferPools[i] = [];
}

function _nextPow16(v) {
  for (var i = 16; i <= (1 << 28); i *= 16) {
    if (v <= i) {
      return i;
    }
  }
  return 0;
}

function _log2(v) {
  var r, shift;
  r = (v > 0xFFFF) << 4; v >>>= r;
  shift = (v > 0xFF) << 3; v >>>= shift; r |= shift;
  shift = (v > 0xF) << 2; v >>>= shift; r |= shift;
  shift = (v > 0x3) << 1; v >>>= shift; r |= shift;
  return r | (v >> 1);
}

function _alloc(n) {
  var sz = _nextPow16(n);
  var bin = _bufferPools[_log2(sz) >> 2];
  if (bin.length > 0) {
    return bin.pop();
  }
  return new ArrayBuffer(sz);
}

function _free(buf) {
  _bufferPools[_log2(buf.byteLength) >> 2].push(buf);
}

var typedArrayPool = {
  alloc_int8: function alloc_int8(n) {
    var result = new Int8Array(_alloc(n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_uint8: function alloc_uint8(n) {
    var result = new Uint8Array(_alloc(n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_int16: function alloc_int16(n) {
    var result = new Int16Array(_alloc(2 * n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_uint16: function alloc_uint16(n) {
    var result = new Uint16Array(_alloc(2 * n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_int32: function alloc_int32(n) {
    var result = new Int32Array(_alloc(4 * n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_uint32: function alloc_uint32(n) {
    var result = new Uint32Array(_alloc(4 * n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_float32: function alloc_float32(n) {
    var result = new Float32Array(_alloc(4 * n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_float64: function alloc_float64(n) {
    var result = new Float64Array(_alloc(8 * n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_dataview: function alloc_dataview(n) {
    var result = new DataView(_alloc(n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  free: function free(array) {
    _free(array.buffer);
  },

  reset: function reset() {
    var _bufferPools = Array(8);
    for (var i = 0; i < 8; ++i) {
      _bufferPools[i] = [];
    }
  },
};

exports.FixedArray = FixedArray;
exports.Pool = Pool;
exports.FramePool = FramePool;
exports.RecyclePool = RecyclePool;
exports.TypedArrayPool = typedArrayPool;
//# sourceMappingURL=memop.js.map
