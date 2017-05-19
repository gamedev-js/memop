const tap = require('tap');
const { TypedArrayPool } = require('../dist/memop');

tap.test('Pool', t => {
  t.test('alloc', t => {
    let array1 = TypedArrayPool.alloc_uint32(20);
    let array2 = TypedArrayPool.alloc_int16(100);

    t.equal(array1.length, 20);
    t.equal(array2.length, 100);

    t.end();
  });

  t.test('free', t => {
    let array1 = TypedArrayPool.alloc_uint32(64);
    let array2 = TypedArrayPool.alloc_uint32(65);

    t.equal(array1.length, 64);
    t.equal(array2.length, 65);
    t.notEqual(array1, array2);

    TypedArrayPool.free(array1);

    let array3 = TypedArrayPool.alloc_uint32(64);
    let array4 = TypedArrayPool.alloc_uint32(64);
    t.equal(array1.buffer, array3.buffer);
    t.notEqual(array1.buffer, array4.buffer);

    t.end();
  });

  t.end();
});