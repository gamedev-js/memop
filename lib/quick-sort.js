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
export default function (array, from, to, cmp) {
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
}