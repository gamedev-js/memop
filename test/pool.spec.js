const tap = require('tap');
const { Pool } = require('../dist/memop');

tap.test('pool', t => {
  t.test('alloc', t => {
    let pool = new Pool(function () {
      return { x: 0, y: 0, z: 0 };
    }, 100);

    t.equal(pool._frees.length, 100);
    t.equal(pool._idx, 99);

    let a = pool.alloc();
    let b = pool.alloc();

    t.deepEqual(a, { x: 0, y: 0, z: 0 });
    t.deepEqual(b, { x: 0, y: 0, z: 0 });
    t.equal(pool._frees.length, 100);
    t.equal(pool._idx, 97);

    t.end();
  });

  t.test('free', t => {
    let pool = new Pool(function () {
      return { x: 0, y: 0, z: 0 };
    }, 100);

    t.equal(pool._frees.length, 100);
    t.equal(pool._idx, 99);

    let a = pool.alloc();
    let b = pool.alloc();

    t.equal(pool._frees.length, 100);
    t.equal(pool._idx, 97);

    pool.free(a);
    pool.free(b);

    t.equal(pool._frees.length, 100);
    t.equal(pool._idx, 99);

    t.end();
  });


  t.test('expand', t => {
    let pool = new Pool(function () {
      return { x: 0, y: 0, z: 0 };
    }, 100);

    pool.alloc();
    pool.alloc();

    t.equal(pool._frees.length, 100);
    t.equal(pool._idx, 97);

    pool._expand(200);

    t.equal(pool._frees.length, 200);
    t.equal(pool._idx, 197);

    t.end();
  });

  t.end();
});