const tap = require('tap');
const { RecyclePool } = require('../dist/memop');

tap.test('RecyclePool', t => {
  t.test('add', t => {
    let arr = new RecyclePool(function () {
      return {
        id: -1,
        age: 0,
        velocity: [1, 1, 1],
      };
    }, 100);

    arr.add().id = 10;
    arr.add().id = 20;
    arr.add().id = 30;
    arr.add().id = 40;
    arr.add().id = 50;

    t.equal(arr.length, 5);
    t.equal(arr.data.length, 100);
    t.equal(arr.data[0].id, 10);
    t.equal(arr.data[1].id, 20);
    t.equal(arr.data[2].id, 30);
    t.equal(arr.data[3].id, 40);
    t.equal(arr.data[4].id, 50);

    t.end();
  });

  t.test('remove', t => {
    let arr = new RecyclePool(function () {
      return {
        id: -1,
        age: 0,
        velocity: [1, 1, 1],
      };
    }, 100);

    arr.add().id = 10;
    arr.add().id = 20;
    arr.add().id = 30;
    arr.add().id = 40;
    arr.add().id = 50;

    arr.remove(2);

    t.equal(arr.length, 4);
    t.equal(arr.data.length, 100);
    t.equal(arr.data[0].id, 10);
    t.equal(arr.data[1].id, 20);
    t.equal(arr.data[2].id, 50);
    t.equal(arr.data[3].id, 40);

    t.equal(arr.data[4].id, 30);

    t.end();
  });

  t.test('reset', t => {
    let arr = new RecyclePool(function () {
      return {
        id: -1,
        age: 0,
        velocity: [1, 1, 1],
      };
    }, 100);

    arr.add().id = 10;
    arr.add().id = 20;
    arr.add().id = 30;
    arr.add().id = 40;
    arr.add().id = 50;

    arr.reset(0);

    t.equal(arr.length, 0);
    t.equal(arr.data.length, 100);
    t.equal(arr.data[0].id, 10);
    t.equal(arr.data[1].id, 20);
    t.equal(arr.data[2].id, 30);
    t.equal(arr.data[3].id, 40);
    t.equal(arr.data[4].id, 50);

    t.end();
  });

  t.test('sort', t => {
    let arr = new RecyclePool(function () {
      return {
        id: -1,
        age: 0,
        velocity: [1, 1, 1],
      };
    }, 100);

    // sort here to make sure it can sort emtpty array
    arr.sort((a, b) => {
      return b.id - a.id;
    });

    arr.add().id = 10;
    arr.add().id = 20;
    arr.add().id = 30;
    arr.add().id = 40;
    arr.add().id = 50;

    arr.sort((a, b) => {
      return b.id - a.id;
    });

    t.equal(arr.data[0].id, 50);
    t.equal(arr.data[1].id, 40);
    t.equal(arr.data[2].id, 30);
    t.equal(arr.data[3].id, 20);
    t.equal(arr.data[4].id, 10);

    t.end();
  });

  t.end();
});