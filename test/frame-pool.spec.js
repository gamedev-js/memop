const tap = require('tap');
const { FramePool } = require('../dist/memop');

tap.test('pool', t => {
  t.test('alloc', t => {
    let pool = new FramePool(function () {
      return new Float32Array(16);
    }, 100);

    t.equal(pool._data.length, 100);
    t.equal(pool._count, 0);

    let a = pool.alloc();
    let b = pool.alloc();

    t.deepEqual(a, new Float32Array(16));
    t.deepEqual(b, new Float32Array(16));
    t.equal(pool._count, 2);

    t.end();
  });

  t.test('clear', t => {
    let pool = new FramePool(function () {
      return new Float32Array(16);
    }, 100);

    t.equal(pool._data.length, 100);
    t.equal(pool._count, 0);

    let a = pool.alloc();
    let b = pool.alloc();

    t.deepEqual(a, new Float32Array(16));
    t.deepEqual(b, new Float32Array(16));
    t.equal(pool._count, 2);

    pool.reset();

    t.equal(pool._data.length, 100);
    t.equal(pool._count, 0);

    t.end();
  });


  t.test('_resize', t => {
    let pool = new FramePool(function () {
      return new Float32Array(16);
    }, 100);

    t.equal(pool._data.length, 100);
    t.equal(pool._count, 0);

    let a = pool.alloc();
    let b = pool.alloc();

    t.deepEqual(a, new Float32Array(16));
    t.deepEqual(b, new Float32Array(16));
    t.equal(pool._count, 2);

    pool._resize(200);

    t.equal(pool._data.length, 200);
    t.equal(pool._count, 2);

    t.end();
  });

  t.end();
});